package com.br.asbuilt.builder.controller.requests

import com.br.asbuilt.address.Address
import com.br.asbuilt.builder.Builder
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class CreateBuilderRequest(
    @field: NotBlank
    val builderName: String,

    @field: NotBlank
    val cnpj: String,

    @field: NotBlank
    val phone: String,

    @field: NotNull
    val builderAddress: Address
) {
    fun toBuilder() = Builder(
        builderName = builderName,
        cnpj = cnpj,
        phone = phone,
        builderAddress = builderAddress
    )
}
