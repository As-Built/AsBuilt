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
    val parameter0Result: Boolean,
    val parameter1Name: String,
    val parameter1Result: Boolean,
    val parameter2Name: String,
    val parameter2Result: Boolean,
    val parameter3Name: String?,
    val parameter3Result: Boolean?,
    val parameter4Name: String?,
    val parameter4Result: Boolean?,
    val parameter5Name: String?,
    val parameter5Result: Boolean?,
    val parameter6Name: String?,
    val parameter6Result: Boolean?,
    val parameter7Name: String?,
    val parameter7Result: Boolean?,
    val parameter8Name: String?,
    val parameter8Result: Boolean?,
    val parameter9Name: String?,
    val parameter9Result: Boolean?,
    val comments: String?
) {
    constructor(taskType: TaskType) : this (
        taskType.id!!,
        taskType.taskTypeName,
        taskType.taskTypeDescription,
        taskType.unitMeasurement,
        taskType.parameter0Name,
        taskType.parameter0Result,
        taskType.parameter1Name,
        taskType.parameter1Result,
        taskType.parameter2Name,
        taskType.parameter2Result,
        taskType.parameter3Name,
        taskType.parameter3Result,
        taskType.parameter4Name,
        taskType.parameter4Result,
        taskType.parameter5Name,
        taskType.parameter5Result,
        taskType.parameter6Name,
        taskType.parameter6Result,
        taskType.parameter7Name,
        taskType.parameter7Result,
        taskType.parameter8Name,
        taskType.parameter8Result,
        taskType.parameter9Name,
        taskType.parameter9Result,
        taskType.comments
    )
}
