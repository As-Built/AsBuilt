package com.br.asbuilt.tasks.controller.responses

import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.locations.Location
import com.br.asbuilt.taskTypes.TaskType
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import com.br.asbuilt.users.controller.responses.UserResponse
import java.util.*

data class TaskResponse(
    val id: Long?,
    val taskType: TaskType,
    val unitaryValue: Double,
    val dimension: Double,
    val unitMeasurement: UnitMeasurement,
    val costCenter: CostCenter,
    val taskLocation: Location,
    val expectedStartDate: Date,
    val startDate: Date?,
    val expectedEndDate: Date,
    val finalDate: Date?,
    val amount: Double,
    val obs: String?,
    val executors: Set<UserResponse>?,
    val evaluators: Set<UserResponse>?
) {
    constructor(task: Task) : this(
        task.id!!,
        task.taskType,
        task.unitaryValue,
        task.dimension,
        task.unitMeasurement,
        task.costCenter,
        task.taskLocation,
        task.expectedStartDate,
        task.startDate,
        task.expectedEndDate,
        task.finalDate,
        task.amount,
        task.obs,
        task.executors.map { UserResponse(it) }.toSet(),
        task.evaluators.map { UserResponse(it) }.toSet()
    )
}
