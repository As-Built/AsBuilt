package com.br.asbuilt.assessment.controller.requests

import com.br.asbuilt.assessment.Assessment
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import jakarta.validation.constraints.NotNull
import java.util.*

data class CreateAssessmentRequest(
    @field:NotNull
    val task: Task,

    @field:NotNull
    val taskExecutors: List<User>,

    @field:NotNull
    val taskEvaluator: User,

    @field:NotNull
    val assessmentDate: Date,

    @field:NotNull
    val parameter0Result: Boolean,

    @field:NotNull
    val parameter1Result: Boolean,

    @field:NotNull
    val parameter2Result: Boolean,

    val parameter3Result: Boolean? = null,

    val parameter4Result: Boolean? = null,

    val parameter5Result: Boolean? = null,

    val parameter6Result: Boolean? = null,

    val parameter7Result: Boolean? = null,

    val parameter8Result: Boolean? = null,

    val parameter9Result: Boolean? = null,

    @field:NotNull
    val assessmentResult: Boolean,

    val obs: String? = null

    ) {
    fun toAssessment() = Assessment(
        task = task,
        taskExecutors = taskExecutors.toMutableList(),
        taskEvaluator = taskEvaluator,
        assessmentDate = assessmentDate,
        parameter0Result = parameter0Result,
        parameter1Result = parameter1Result,
        parameter2Result = parameter2Result,
        parameter3Result = parameter3Result,
        parameter4Result = parameter4Result,
        parameter5Result = parameter5Result,
        parameter6Result = parameter6Result,
        parameter7Result = parameter7Result,
        parameter8Result = parameter8Result,
        parameter9Result = parameter9Result,
        assessmentResult = assessmentResult,
        obs = obs
    )
}
