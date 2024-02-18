package com.br.asbuilt.users.controller.requests

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @NotBlank
    val email: String?,

    @NotBlank
    val password: String?
)
