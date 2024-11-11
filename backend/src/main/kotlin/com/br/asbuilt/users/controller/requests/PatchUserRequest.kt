package com.br.asbuilt.users.controller.requests

import com.br.asbuilt.address.Address
import com.br.asbuilt.salary.Salary
import com.br.asbuilt.users.User
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class PatchUserRequest(
    @field:NotNull
    val id: Long?,

    @field:NotBlank
    val name: String?,

    @field:NotBlank
    val email: String?,

    @field:NotBlank
    val cpf: String?,

    @field:NotNull
    var userAddress: Address?,

    @field:NotBlank
    val phone: String?,

    val photo: String?,

    val salaries: Set<Salary>?,

    val systemLanguage: String?,

) {

    fun toUser() {
        User(
        id = id,
        name = name!!,
        email = email!!,
        cpf = cpf!!,
        userAddress = userAddress,
        phone = phone!!,
        photo = photo,
        systemLanguage = systemLanguage!!
    )
    }
}