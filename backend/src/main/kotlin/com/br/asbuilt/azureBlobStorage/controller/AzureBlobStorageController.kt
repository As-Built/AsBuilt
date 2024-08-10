package com.br.asbuilt.azureBlobStorage.controller

import com.br.asbuilt.azureBlobStorage.AzureBlobStorageResourceProvider
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.util.*

@RestController
@RequestMapping("blob")
class AzureBlobStorageController @Autowired constructor(
    private val azureBlobStorageResourceProvider: AzureBlobStorageResourceProvider
) {

    @PostMapping("/writeBlobFile")
    @Throws(IOException::class)
    fun writeBlobFile(@RequestParam blobName: String, @RequestParam data: MultipartFile): String {
        val finalBlobName = if (blobName.substringBefore(".") == "newProfilePicture") {
            "${UUID.randomUUID()}.${blobName.substringAfter(".")}"
        } else {
            blobName
        }
        azureBlobStorageResourceProvider.uploadBlob(finalBlobName, data.inputStream, data.size, overwrite = true)
        log.info("File updated: {}", finalBlobName)
        return "File was updated"
    }

    companion object {
        private val log = LoggerFactory.getLogger(AzureBlobStorageController::class.java)
    }
}