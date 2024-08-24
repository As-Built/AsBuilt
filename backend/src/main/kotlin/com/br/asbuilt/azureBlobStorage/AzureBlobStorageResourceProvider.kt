package com.br.asbuilt.azureBlobStorage

import com.azure.storage.blob.BlobServiceClientBuilder
import com.azure.storage.blob.specialized.BlockBlobClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.io.BufferedInputStream
import java.io.InputStream

@Component
class AzureBlobStorageResourceProvider {

    @Value("\${azure.blob.sas.url}")
    private lateinit var blobUrl: String

    fun getWritableResource(blobName: String): BlockBlobClient {
        return BlobServiceClientBuilder()
            .endpoint(blobUrl)
            .buildClient()
            .getBlobContainerClient("asbuilt-photos")
            .getBlobClient(blobName)
            .blockBlobClient
    }

    fun uploadBlob(blobName: String, data: InputStream, length: Long, overwrite: Boolean = true) {
        val bufferedData = BufferedInputStream(data)
        val blobClient = getWritableResource(blobName)
        blobClient.upload(bufferedData, length, overwrite)
    }

    fun getBlobUrl(blobName: String): String {
        return "https://asbuiltstoragedata.blob.core.windows.net/asbuilt-photos/${blobName}"
    }

    fun downloadBlob(blobNameWithoutExtension: String): Pair<String, InputStream> {
        val containerClient = BlobServiceClientBuilder()
            .endpoint(blobUrl)
            .buildClient()
            .getBlobContainerClient("asbuilt-photos")

        val blobItem = containerClient.listBlobs()
            .firstOrNull { it.name.startsWith(blobNameWithoutExtension) }
            ?: throw Exception("Blob not found")

        val blobClient = containerClient.getBlobClient(blobItem.name).blockBlobClient
        return Pair(blobItem.name, blobClient.openInputStream())
    }
}