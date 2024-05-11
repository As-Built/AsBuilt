package com.br.asbuilt.builder.controller.responses

import com.br.asbuilt.address.Address
import com.br.asbuilt.builder.Builder

data class BuilderResponse(
    val id: Long?,
    val builderName: String,
    val cnpj: String,
    val phone: String?,
    val builderAddress: Address
) {
    constructor(builder: Builder) : this (
        builder.id!!,
        builder.builderName,
        builder.cnpj,
        builder.phone,
        builder.builderAddress
    )
}