package com.br.asbuilt.productionValue.controller.requests

import com.br.asbuilt.assessment.Assessment
import com.br.asbuilt.productionValue.ProductionValue
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import jakarta.validation.constraints.NotNull
import java.util.Date

data class CreateProductionValueRequest(
    val value: Double,

    @field:NotNull
    val date: Date,

    @field:NotNull
    val user: User,

    @field:NotNull
    val task: Task,

    @field:NotNull
    val assessment: Assessment,

    @field:NotNull
    val assessmentPercentage: Double
) {
    fun toProductionValue() = ProductionValue(
        value = value,
        date = date,
        user = user,
        task = task,
        assessment = assessment,
        assessmentPercentage = assessmentPercentage
    )
}
