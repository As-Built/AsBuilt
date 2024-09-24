package com.br.asbuilt.azureBlobStorage

import com.br.asbuilt.assessment.AssessmentRepository
import com.br.asbuilt.azureBlobStorage.controller.responses.AzureBlobStorageResponse
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*
import org.springframework.http.HttpHeaders
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileOutputStream

@Service
class AzureBlobStorageService @Autowired constructor(
    private val azureBlobStorageResourceProvider: AzureBlobStorageResourceProvider,
    private val userRepository: UserRepository,
    private val assessmentRepository: AssessmentRepository
) {

    fun updateProfilePicture(userId: Long, azureBlobStorage: AzureBlobStorage): ResponseEntity<AzureBlobStorageResponse> {
        //Pesquisar usuário pelo id
        val user = userRepository.findById(userId).orElseThrow { Exception("User not found") }
        //Caso o usuário não tenha foto, é gerado um novo guid e salvo no banco
        val finalFileName = if (user.photo == null) {
            val newGuid = UUID.randomUUID().toString()
            user.photo = newGuid
            userRepository.save(user)
            "$newGuid.${azureBlobStorage.blobName.substringAfter(".")}"
        } else {
            user.photo!! + "." + azureBlobStorage.blobName.substringAfter(".")
        }

        return try {
            //Upload da foto no blob storage
            azureBlobStorageResourceProvider.uploadBlob(finalFileName, azureBlobStorage.data.inputStream,
                azureBlobStorage.data.size, overwrite = true)
            //Retorno do nome da foto e a url do blob storage
            val fileUrl = azureBlobStorageResourceProvider.getBlobUrl(finalFileName)
            //Log de sucesso
            log.info("Profile picture uploaded successfully: {}", finalFileName)
            //Retorno do nome da foto e a url do blob storage
            ResponseEntity.status(HttpStatus.OK).body(AzureBlobStorageResponse(finalFileName, fileUrl))
        } catch (e: Exception) {
            //Caso ocorra algum erro, é retornado um erro interno
            val fileUrl = azureBlobStorageResourceProvider.getBlobUrl(finalFileName)
            log.error("Failed to upload profilePicture: {}", finalFileName, e)
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AzureBlobStorageResponse("Failed to upload profilePicture", fileUrl))
        }
    }

    fun downloadProfilePicture(fileNameWithoutExtension: String): ResponseEntity<Resource> {
        return try {
            //Download da foto do blob storage
            val (fileName, inputStream) = azureBlobStorageResourceProvider.downloadBlob(fileNameWithoutExtension)
            val tempFile = File.createTempFile(fileName, null)
            //Criação de um arquivo temporário para armazenar a foto
            FileOutputStream(tempFile).use { outputStream ->
                inputStream.copyTo(outputStream)
            }
            //Retorno do arquivo temporário
            val resource = FileSystemResource(tempFile)
            log.also { log ->
                log.info("Profile picture downloaded successfully: {}", fileName)
            }
            //Retorno do arquivo temporário
            ResponseEntity.ok()
                //Adiciona o header para download do arquivo
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"$fileName\"")
                //Adiciona o tipo do arquivo
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                //Adiciona o arquivo
                .body(resource)
        } catch (e: Exception) {
            //Caso ocorra algum erro, é retornado um erro interno
            log.error("Error when downloading profile picture: ${e.message}", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    fun uploadAssessmentPhotos(assessmentId: Long, files: List<MultipartFile>): ResponseEntity<List<AzureBlobStorageResponse>> {
        val assessment = assessmentRepository.findById(assessmentId).orElseThrow { Exception("Assessment not found") }
        val responses = mutableListOf<AzureBlobStorageResponse>()

        files.forEachIndexed { index, file ->
            val newGuid = UUID.randomUUID().toString()
            val finalFileName = "$newGuid.${file.originalFilename?.substringAfter(".")}"

            try {
                azureBlobStorageResourceProvider.uploadBlob(finalFileName, file.inputStream, file.size, overwrite = false)
                val fileUrl = azureBlobStorageResourceProvider.getBlobUrl(finalFileName)
                responses.add(AzureBlobStorageResponse(finalFileName, fileUrl))
                log.info("Assessment picture uploaded successfully: {}", finalFileName)

                // Atualiza a entidade Assessment com o GUID da imagem
                when (index) {
                    0 -> assessment.assessmentPhoto0 = newGuid
                    1 -> assessment.assessmentPhoto1 = newGuid
                    2 -> assessment.assessmentPhoto2 = newGuid
                    3 -> assessment.assessmentPhoto3 = newGuid
                    4 -> assessment.assessmentPhoto4 = newGuid
                    5 -> assessment.assessmentPhoto5 = newGuid
                }
            } catch (e: Exception) {
                log.error("Failed to upload assessment picture: {}", finalFileName, e)
                responses.add(AzureBlobStorageResponse("Failed to upload assessment picture", ""))
            }
        }

        // Salva a entidade Assessment atualizada no repositório
        assessmentRepository.save(assessment)

        return ResponseEntity.status(HttpStatus.OK).body(responses)
    }


    companion object {
        private val log = LoggerFactory.getLogger(AzureBlobStorageService::class.java)
    }
}