package com.br.asbuilt.tasks.controller.responses

import com.br.asbuilt.costCenters.controller.responses.CostCenterResponse
import com.br.asbuilt.locations.controller.responses.LocationResponse
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
    val costCenter: CostCenterResponse,
    val taskLocation: LocationResponse,
    val startDate: Date,
    val expectedEndDate: Date,
    val finalDate: Date?,
    val amount: Double,
    val obs: String?,
    val executor: Set<UserResponse>?,
    val conferente: Set<UserResponse>?
) {
    constructor(task: Task) : this(
        task.id!!,
        task.taskType,
        task.unitaryValue,
        task.dimension,
        task.unitMeasurement,
        CostCenterResponse(task.costCenter),
        LocationResponse(task.taskLocation),
        task.startDate,
        task.expectedEndDate,
        task.finalDate,
        task.amount,
        task.obs,
        task.executor.map { UserResponse(it) }.toSet(),
        task.conferente.map { UserResponse(it) }.toSet()
    )
}
