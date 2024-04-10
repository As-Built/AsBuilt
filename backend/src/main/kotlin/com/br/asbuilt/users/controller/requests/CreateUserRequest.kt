package com.br.asbuilt.users.controller.requests

import com.br.asbuilt.users.User
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class CreateUserRequest(
    @field:NotBlank
    val cpf: String?,
    @field:NotBlank
    val name: String?,
    @field:Email
    val email: String?,
//    A linha abaixo está comentada apenas para teste de cadastro de usuário, permitindo qualquer tipo de senha
//    @field:Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@\$!%*#?&])[A-Za-z\\d@\$!%*#?&]{8,}\$")
    @field:NotBlank
    val password: String?

) {
    fun toUser() = User(
        cpf = cpf!!,
        name = name!!,
        email = email!!,
        password = password!!
    )
}