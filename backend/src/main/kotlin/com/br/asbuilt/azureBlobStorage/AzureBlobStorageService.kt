package com.br.asbuilt.azureBlobStorage

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
import java.io.File
import java.io.FileOutputStream

@Service
class AzureBlobStorageService @Autowired constructor(
    private val azureBlobStorageResourceProvider: AzureBlobStorageResourceProvider,
    private val userRepository: UserRepository
) {

    fun writeBlobFile(userId: Long, azureBlobStorage: AzureBlobStorage): ResponseEntity<AzureBlobStorageResponse> {
        val user = userRepository.findById(userId).orElseThrow { Exception("User not found") }
        val finalBlobName = if (user.photo == null) {
            val newGuid = UUID.randomUUID().toString()
            user.photo = newGuid
            userRepository.save(user)
            "$newGuid.${azureBlobStorage.blobName.substringAfter(".")}"
        } else {
            user.photo!! + "." + azureBlobStorage.blobName.substringAfter(".")
        }

        return try {
            azureBlobStorageResourceProvider.uploadBlob(finalBlobName, azureBlobStorage.data.inputStream,
                azureBlobStorage.data.size, overwrite = true)
            val blobUrl = azureBlobStorageResourceProvider.getBlobUrl(finalBlobName)

            log.info("Blob uploaded successfully: {}", finalBlobName)
            ResponseEntity.status(HttpStatus.OK).body(AzureBlobStorageResponse(finalBlobName, blobUrl))
        } catch (e: Exception) {
            val blobUrl = azureBlobStorageResourceProvider.getBlobUrl(finalBlobName)

            log.error("Failed to upload blob: {}", finalBlobName, e)
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AzureBlobStorageResponse("Failed to upload blob", blobUrl))
        }
    }

    fun downloadBlobFile(blobNameWithoutExtension: String): ResponseEntity<Resource> {
        return try {
            val (blobName, inputStream) = azureBlobStorageResourceProvider.downloadBlob(blobNameWithoutExtension)
            val tempFile = File.createTempFile(blobName, null)
            FileOutputStream(tempFile).use { outputStream ->
                inputStream.copyTo(outputStream)
            }
            val resource = FileSystemResource(tempFile)
            log.also { log ->
                log.info("Blob downloaded successfully: {}", blobName)
            }
            ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"$blobName\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource)
        } catch (e: Exception) {
            log.error("Erro ao baixar o blob: ${e.message}", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    companion object {
        private val log = LoggerFactory.getLogger(AzureBlobStorageService::class.java)
    }
}