package com.br.asbuilt.users.controller.responses

import com.br.asbuilt.users.User

data class UserResponse(
    val id: Long,
    val email: String,
    val name: String,
) {
    constructor(user: User) : this(user.id!!, user.email, user.name)
}