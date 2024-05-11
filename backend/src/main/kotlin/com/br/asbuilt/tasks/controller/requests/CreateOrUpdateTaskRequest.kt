package com.br.asbuilt.tasks.controller.requests

import com.br.asbuilt.tasks.Task
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.util.*

data class CreateOrUpdateTaskRequest(
    @field:NotBlank
    val taskType: String,

    @field:NotNull
    val unitaryValue: Double,

    @field:NotNull
    val dimension: Double,

    @field:NotBlank
    val unitmeasurement: String,

    @field:NotNull
    val costCenterId: Long,

    @field:NotBlank
    val placeOfExecution: String,

    @field:NotNull
    val startDate: Date,

    @field:NotNull
    val expectedEndDate: Date,

    val finalDate: Date?,

    val obs: String?,

    val executor: Set<Long>?,

    val conferente: Set<Long>?,

    ){
    fun toTask() = Task (
        taskType = taskType,
        unitaryValue = unitaryValue,
        dimension = dimension,
        unitMeasurement = unitmeasurement,
        placeOfExecution = placeOfExecution,
        startDate = startDate,
        expectedEndDate = expectedEndDate,
        finalDate = finalDate,
        amount = unitaryValue * dimension,
        obs = obs
    )
}