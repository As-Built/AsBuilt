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
    val parameter0Result: Boolean,
    val parameter1Result: Boolean,
    val parameter2Result: Boolean,
    val parameter3Result: Boolean,
    val parameter4Result: Boolean?,
    val parameter5Result: Boolean?,
    val parameter6Result: Boolean?,
    val parameter7Result: Boolean?,
    val parameter8Result: Boolean?,
    val parameter9Result: Boolean?,
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
        assessment.parameter3Result!!,
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
