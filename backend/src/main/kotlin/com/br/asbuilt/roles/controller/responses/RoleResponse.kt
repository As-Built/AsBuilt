package com.br.asbuilt.roles.controller.responses

import com.br.asbuilt.roles.Role
data class RoleResponse(
    val name: String,
    val description: String
) {
    constructor(role: Role) : this(name = role.name, description = role.description)
}
