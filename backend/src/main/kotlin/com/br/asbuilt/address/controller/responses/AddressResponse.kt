package com.br.asbuilt.address.controller.responses

import com.br.asbuilt.address.Address

data class AddressResponse(
    val id: Long?,
    val street: String,
    val number: Int,
    val city: String,
    val state: String,
    val postalCode: String
){
    constructor(address: Address) : this (
        address.id!!,
        address.street!!,
        address.number!!,
        address.city!!,
        address.state!!,
        address.postalCode!!
    )
}
