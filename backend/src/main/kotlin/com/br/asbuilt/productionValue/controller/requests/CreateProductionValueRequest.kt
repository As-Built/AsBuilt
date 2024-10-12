package com.br.asbuilt.productionValue.controller.requests

import com.br.asbuilt.productionValue.ProductionValue
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import jakarta.validation.constraints.NotNull
import java.util.Date

data class CreateProductionValueRequest(
    @field:NotNull
    val value: Double,

    @field:NotNull
    val date: Date,

    @field:NotNull
    val user: User,

    @field:NotNull
    val task: Task
) {
    fun toProductionValue() = ProductionValue(
        value = value,
        date = date,
        user = user,
        task = task
    )
}
