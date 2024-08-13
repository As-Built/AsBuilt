package com.br.asbuilt.users.controller.responses

import com.br.asbuilt.address.Address
import com.br.asbuilt.users.User

data class UserResponse(
    val id: Long,
    val email: String,
    val name: String,
    val cpf: String,
    val userAddress: Address,
    val phone: String,
    val photo: String?,
) {
    constructor(user: User) : this(
        user.id!!,
        user.email,
        user.name,
        user.cpf,
        user.userAddress ?: Address(),
        user.phone,
        user.photo
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as UserResponse

        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false

        return true
    }
}