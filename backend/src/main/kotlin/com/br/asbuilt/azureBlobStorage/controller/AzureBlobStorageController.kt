package com.br.asbuilt.azureBlobStorage.controller

import com.br.asbuilt.azureBlobStorage.AzureBlobStorage
import com.br.asbuilt.azureBlobStorage.AzureBlobStorageService
import com.br.asbuilt.azureBlobStorage.controller.requests.AzureBlobStorageRequest
import com.br.asbuilt.azureBlobStorage.controller.responses.AzureBlobStorageResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.core.io.Resource
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
    @PostMapping("/updateProfilePicture", consumes = ["multipart/form-data"])
    fun updateProfilePicture(@RequestParam("userId") userId: Long, @Valid @RequestPart("fileName") fileName: String,
                             @RequestPart("data") data: MultipartFile): ResponseEntity<AzureBlobStorageResponse> {
        // Cria um AzureBlobStorage object
        val azureBlobStorage = AzureBlobStorage(
            blobName = fileName,
            data = AzureBlobStorageRequest(
                inputStream = data.inputStream,
                size = data.size
            )
        )
        return service.updateProfilePicture(userId, azureBlobStorage)
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/downloadProfilePicture")
    fun downloadBlobFile(@RequestParam("fileName") fileNameWithoutExtension: String): ResponseEntity<org.springframework.core.io.Resource> {
        return service.downloadProfilePicture(fileNameWithoutExtension)
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @PostMapping("/uploadAssessmentPhotos", consumes = ["multipart/form-data"])
    fun uploadAssessmentPhotos(
        @RequestParam("assessmentId") assessmentId: Long,
        @RequestPart("file0") file0: MultipartFile,
        @RequestPart("file1") file1: MultipartFile,
        @RequestPart("file2") file2: MultipartFile,
        @RequestPart("file3", required = false) file3: MultipartFile?,
        @RequestPart("file4", required = false) file4: MultipartFile?,
        @RequestPart("file5", required = false) file5: MultipartFile?
    ): ResponseEntity<List<AzureBlobStorageResponse>> {
        val files = listOfNotNull(file0, file1, file2, file3, file4, file5)
        return service.uploadAssessmentPhotos(assessmentId, files)
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/downloadAssessmentPhotos")
    fun downloadAssessmentPhotos(@RequestParam fileNamesWithoutExtension: List<String>, response: HttpServletResponse) {
        service.downloadAssessmentPhotos(fileNamesWithoutExtension, response)
    }
}