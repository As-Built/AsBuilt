package com.br.asbuilt.users.controller.requests

import com.br.asbuilt.address.Address
import com.br.asbuilt.users.User
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

data class CreateUserRequest(
    @field:NotBlank
    val cpf: String?,
    @field:NotBlank
    val name: String?,
    @field:Email
    val email: String?,
    //A senha deve possuir ao menos uma letra maíuscula e uma letra minúscula
    //A senha deve possuir ao menos um número
    //A senha deve conter pelo menos um caractere especial (@, $, !, %, *, #, ?, &)
    //A senha deve ter pelo menos 8 dígitos
    @field:Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@\$!%*#?&])[A-Za-z\\d@\$!%*#?&]{8,12}\$")
    val password: String?,

) {
    fun toUser() = User(
        cpf = cpf!!,
        name = name!!,
        email = email!!,
        password = password!!,
    )
}