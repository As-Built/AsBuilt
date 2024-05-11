package com.br.asbuilt.builder.controller.requests

import com.br.asbuilt.address.Address
import jakarta.validation.constraints.NotBlank

data class PatchBuilderAddressRequest(
    @field:NotBlank
    val builderAddress: Address
)
