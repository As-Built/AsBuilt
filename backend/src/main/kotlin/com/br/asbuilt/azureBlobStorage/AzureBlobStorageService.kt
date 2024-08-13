package com.br.asbuilt.azureBlobStorage

import com.br.asbuilt.azureBlobStorage.controller.responses.AzureBlobStorageResponse
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

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
            log.info("Blob uploaded successfully: {}", finalBlobName)
            ResponseEntity.status(HttpStatus.OK).body(AzureBlobStorageResponse(finalBlobName, "URL to access the blob"))
        } catch (e: Exception) {
            log.error("Failed to upload blob: {}", finalBlobName, e)
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AzureBlobStorageResponse("Failed to upload blob", "Error URL"))
        }
    }

    companion object {
        private val log = LoggerFactory.getLogger(AzureBlobStorageService::class.java)
    }
}