package com.br.asbuilt.tasks.controller.requests

import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.locations.Location
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
    val unitMeasurement: String,

    @field:NotNull
    val costCenter: CostCenter,

    @field:NotNull
    val taskLocation: Location,

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
        costCenter = costCenter,
        dimension = dimension,
        unitMeasurement = unitMeasurement,
        taskLocation = taskLocation,
        startDate = startDate,
        expectedEndDate = expectedEndDate,
        finalDate = finalDate,
        amount = unitaryValue * dimension,
        obs = obs
    )
}