package com.br.asbuilt.builder.controller.requests

import jakarta.validation.constraints.NotBlank

data class PatchBuilderPhoneRequest(

    @field:NotBlank
    val builderPhone: String
)
