package com.br.asbuilt.assessment.controller.responses

import com.br.asbuilt.assessment.Assessment
import com.br.asbuilt.tasks.controller.responses.TaskResponse
import com.br.asbuilt.users.controller.responses.UserResponse
import java.util.*

data class AssessmentResponse(
    val id: Long?,
    val task: TaskResponse,
    val taskExecutors: List<UserResponse>,
    val taskEvaluator: UserResponse,
    val assessmentDate: Date,
    val assesmentParameter0Result: Boolean,
    val assesmentParameter1Result: Boolean,
    val assesmentParameter2Result: Boolean,
    val assesmentParameter3Result: Boolean?,
    val assesmentParameter4Result: Boolean?,
    val assesmentParameter5Result: Boolean?,
    val assesmentParameter6Result: Boolean?,
    val assesmentParameter7Result: Boolean?,
    val assesmentParameter8Result: Boolean?,
    val assesmentParameter9Result: Boolean?,
    val assessmentResult: Boolean,
    val obs: String?
) {
    constructor(assessment: Assessment) : this(
        assessment.id,
        assessment.task?.let { TaskResponse(it) }!!,
        assessment.taskExecutors.map { UserResponse(it) },
        UserResponse(assessment.taskEvaluator),
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
        assessment.assessmentResult!!,
        assessment.obs
    )
}
