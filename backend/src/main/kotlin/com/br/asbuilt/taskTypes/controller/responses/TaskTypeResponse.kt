package com.br.asbuilt.taskTypes.controller.responses

import com.br.asbuilt.taskTypes.TaskType
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class TaskTypeResponse(
    val id: Long,
    val taskTypeName: String,
    val taskTypeDescription: String,
    val unitMeasurement: UnitMeasurement,
    val parameter0Name: String,
    val parameter1Name: String,
    val parameter2Name: String,
    val parameter3Name: String?,
    val parameter4Name: String?,
    val parameter5Name: String?,
    val parameter6Name: String?,
    val parameter7Name: String?,
    val parameter8Name: String?,
    val parameter9Name: String?,
    val comments: String?
) {
    constructor(taskType: TaskType) : this (
        taskType.id!!,
        taskType.taskTypeName,
        taskType.taskTypeDescription,
        taskType.unitMeasurement,
        taskType.parameter0Name,
        taskType.parameter1Name,
        taskType.parameter2Name,
        taskType.parameter3Name,
        taskType.parameter4Name,
        taskType.parameter5Name,
        taskType.parameter6Name,
        taskType.parameter7Name,
        taskType.parameter8Name,
        taskType.parameter9Name,
        taskType.comments
    )
}
