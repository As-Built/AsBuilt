package com.br.asbuilt.tasks.controller.requests

import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.locations.Location
import com.br.asbuilt.taskTypes.TaskType
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.util.*

data class CreateTaskRequest(
    @field:NotBlank
    val taskType: TaskType,

    @field:NotNull
    val unitaryValue: Double,

    @field:NotNull
    val dimension: Double,

    @field:NotBlank
    val unitMeasurement: UnitMeasurement,

    @field:NotNull
    val costCenter: CostCenter,

    @field:NotNull
    val taskLocation: Location,

    @field:NotNull
    val expectedStartDate: Date,

    val startDate: Date?,

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
        expectedStartDate = expectedStartDate,
        startDate = startDate,
        expectedEndDate = expectedEndDate,
        finalDate = finalDate,
        amount = unitaryValue * dimension,
        obs = obs
    )
}