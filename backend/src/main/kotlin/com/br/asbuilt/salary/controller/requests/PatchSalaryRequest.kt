package com.br.asbuilt.salary.controller.requests

import com.br.asbuilt.salary.Salary
import com.br.asbuilt.users.User
import org.jetbrains.annotations.NotNull
import java.util.*

data class PatchSalaryRequest(
    @field:jakarta.validation.constraints.NotNull
    val id: Long,

    @field:NotNull
    val value: Double,

    @field:NotNull
    val updateDate: Date,

    @field:NotNull
    val user: User
) {
    fun toSalary() = Salary(
        id = id,
        value = value,
        updateDate = updateDate,
        user = user
    )
}
