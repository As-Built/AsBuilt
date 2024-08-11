package com.br.asbuilt.azureBlobStorage.controller.requests

import java.io.InputStream

data class AzureBlobStorageRequest(
    val inputStream: InputStream,
    val size: Long
)
