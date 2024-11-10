package com.br.asbuilt.users.controller.requests

import com.br.asbuilt.address.Address
import com.br.asbuilt.users.User
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class PatchSystemLanguage (
    @field:NotNull
    val id: Long,

    val systemLanguage: String,

    ) {
    fun toUser() = User(
        id = id,
        systemLanguage = systemLanguage
    )
}