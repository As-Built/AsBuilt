package com.br.asbuilt.azureBlobStorage.controller

import com.azure.core.management.Resource
import com.br.asbuilt.azureBlobStorage.AzureBlobStorage
import com.br.asbuilt.azureBlobStorage.AzureBlobStorageService
import com.br.asbuilt.azureBlobStorage.controller.requests.AzureBlobStorageRequest
import com.br.asbuilt.azureBlobStorage.controller.responses.AzureBlobStorageResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("blob")
class AzureBlobStorageController (
    val service: AzureBlobStorageService
) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @PostMapping("/writeBlobFile", consumes = ["multipart/form-data"])
    fun updateProfilePicture(@RequestParam("userId") userId: Long, @Valid @RequestPart("blobName") blobName: String,
                             @RequestPart("data") data: MultipartFile): ResponseEntity<AzureBlobStorageResponse> {
        val azureBlobStorage = AzureBlobStorage(
            blobName = blobName,
            data = AzureBlobStorageRequest(
                inputStream = data.inputStream,
                size = data.size
            )
        )
        return service.writeBlobFile(userId, azureBlobStorage)
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/downloadBlobFile")
    fun downloadBlobFile(@RequestParam("blobName") blobNameWithoutExtension: String): ResponseEntity<org.springframework.core.io.Resource> {
        return service.downloadBlobFile(blobNameWithoutExtension)
    }
}