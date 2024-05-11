package com.br.asbuilt.builder.controller.requests

import com.br.asbuilt.builder.Builder
import jakarta.validation.constraints.NotBlank

data class PatchBuilderNameRequest(
    @field:NotBlank
    val builderName: String
)
