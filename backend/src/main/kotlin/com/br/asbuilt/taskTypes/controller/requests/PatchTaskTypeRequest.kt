package com.br.asbuilt.taskTypes.controller.requests

import com.br.asbuilt.taskTypes.TaskType
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class PatchTaskTypeRequest(
    @field: NotNull
    val id: Long,

    @field: NotBlank
    val taskTypeName: String,

    @field: NotBlank
    val taskTypeDescription: String,

    @field: NotNull
    val unitMeasurement: UnitMeasurement,

    @field: NotBlank
    val parameter0Name: String,

    @field: NotNull
    val parameter0Result: Boolean,

    @field: NotBlank
    val parameter1Name: String,

    @field: NotNull
    val parameter1Result: Boolean,

    @field: NotBlank
    val parameter2Name: String,

    @field: NotNull
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
    fun toTaskType() = TaskType(
        id = id,
        taskTypeName = taskTypeName,
        taskTypeDescription = taskTypeDescription,
        unitMeasurement = unitMeasurement,
        parameter0Name = parameter0Name,
        parameter0Result = parameter0Result,
        parameter1Name = parameter1Name,
        parameter1Result = parameter1Result,
        parameter2Name = parameter2Name,
        parameter2Result = parameter2Result,
        parameter3Name = parameter3Name,
        parameter3Result = parameter3Result,
        parameter4Name = parameter4Name,
        parameter4Result = parameter4Result,
        parameter5Name = parameter5Name,
        parameter5Result = parameter5Result,
        parameter6Name = parameter6Name,
        parameter6Result = parameter6Result,
        parameter7Name = parameter7Name,
        parameter7Result = parameter7Result,
        parameter8Name = parameter8Name,
        parameter8Result = parameter8Result,
        parameter9Name = parameter9Name,
        parameter9Result = parameter9Result,
        comments = comments
    )
}