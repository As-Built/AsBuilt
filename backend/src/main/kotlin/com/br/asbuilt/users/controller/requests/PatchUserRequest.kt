package com.br.asbuilt.users.controller.requests

import com.br.asbuilt.address.Address
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class PatchUserRequest(
    @field:NotNull
    val id: Long?,

    @field:NotBlank
    val name: String?,

//    @field:NotBlank
//    val password: String?,

    @field:NotBlank
    val cpf: String?,

    @field:NotNull
    val userAddress: Address?,

    @field:NotBlank
    val phone: String?,

    val photo: ByteArray?

) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PatchUserRequest

        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false

        return true
    }

    override fun hashCode(): Int {
        return photo?.contentHashCode() ?: 0
    }
}