package com.br.asbuilt.tasks.controller.responses

import com.br.asbuilt.costCenters.controller.responses.CostCenterResponse
import com.br.asbuilt.tasks.Task
import java.util.*

data class TaskResponse(
    val id: Long?,
    val taskType: String,
    val unitaryValue: Double,
    val dimension: Double,
    val unitMeasurement: String,
    val costCenter: CostCenterResponse,
    val placeOfExecution: String,
    val startDate: Date,
    val expectedEndDate: Date,
    val finalDate: Date?,
    val amount: Double,
    val obs: String?,
//    val executor: Set<UserResponse>,
//    val conferente: Set<UserResponse>
) {
    constructor(task: Task) : this(
        task.id!!,
        task.taskType,
        task.unitaryValue,
        task.dimension,
        task.unitMeasurement,
        task.costCenter?.let { CostCenterResponse(it) }!!,
        task.placeOfExecution,
        task.startDate,
        task.expectedEndDate,
        task.finalDate,
        task.amount,
        task.obs,
//        task.executor.map { UserResponse(it) }.toSet(),
//        task.conferente.map { UserResponse(it) }.toSet()
    )
}
