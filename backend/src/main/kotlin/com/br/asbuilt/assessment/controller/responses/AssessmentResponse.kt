package com.br.asbuilt.assessment.controller.responses

import com.br.asbuilt.assessment.Assessment
import com.br.asbuilt.tasks.controller.responses.TaskResponse
import com.br.asbuilt.users.controller.responses.UserResponse
import java.util.*

data class AssessmentResponse(
    val id: Long?,
    val task: TaskResponse,
    val taskExecutors: List<UserResponse>,
    val taskEvaluators: List<UserResponse>,
    val assessmentDate: Date,
    val assessmentParameter0Result: Boolean,
    val assessmentParameter1Result: Boolean,
    val assessmentParameter2Result: Boolean,
    val assessmentParameter3Result: Boolean?,
    val assessmentParameter4Result: Boolean?,
    val assessmentParameter5Result: Boolean?,
    val assessmentParameter6Result: Boolean?,
    val assessmentParameter7Result: Boolean?,
    val assessmentParameter8Result: Boolean?,
    val assessmentParameter9Result: Boolean?,
    val assessmentResult: Boolean,
    val obs: String?,
    val assessmentPhoto0: String?,
    val assessmentPhoto1: String?,
    val assessmentPhoto2: String?,
    val assessmentPhoto3: String?,
    val assessmentPhoto4: String?,
    val assessmentPhoto5: String?,
    val isReassessment: Boolean

) {
    constructor(assessment: Assessment) : this(
        assessment.id,
        assessment.task?.let { TaskResponse(it) }!!,
        assessment.taskExecutors.map { UserResponse(it) },
        assessment.taskEvaluators.map { UserResponse(it) },
        assessment.assessmentDate,
        assessment.parameter0Result!!,
        assessment.parameter1Result!!,
        assessment.parameter2Result!!,
        assessment.parameter3Result,
        assessment.parameter4Result,
        assessment.parameter5Result,
        assessment.parameter6Result,
        assessment.parameter7Result,
        assessment.parameter8Result,
        assessment.parameter9Result,
        assessment.assessmentResult,
        assessment.obs,
        assessment.assessmentPhoto0,
        assessment.assessmentPhoto1,
        assessment.assessmentPhoto2,
        assessment.assessmentPhoto3,
        assessment.assessmentPhoto4,
        assessment.assessmentPhoto5,
        assessment.isReassessment
    )
}
