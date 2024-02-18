package com.br.asbuilt.users.controller.responses

data class LoginResponse(
    val token: String,
    val user: UserResponse
)
