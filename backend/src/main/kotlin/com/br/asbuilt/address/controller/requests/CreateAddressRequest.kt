package com.br.asbuilt.address.controller.requests

import com.br.asbuilt.address.Address
import jakarta.validation.constraints.NotBlank

data class CreateAddressRequest (
    @field: NotBlank
    val street: String,
    @field: NotBlank
    var number: Int,
    @field: NotBlank
    var city: String,
    @field: NotBlank
    var state: String,
    @field: NotBlank
    var postalCode: String
) {
    fun toAddress() = Address(
        street = street,
        number = number,
        city = city,
        state = state,
        postalCode = postalCode
    )
}