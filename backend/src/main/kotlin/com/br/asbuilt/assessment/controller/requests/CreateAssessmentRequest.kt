package com.br.asbuilt.assessment.controller.requests

import com.br.asbuilt.assessment.Assessment
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import com.br.asbuilt.users.controller.requests.PatchUserRequest
import jakarta.validation.constraints.NotNull
import java.util.*

data class CreateAssessmentRequest(
    @field:NotNull
    val taskId: Long, // Receba apenas o ID da Task

    @field:NotNull
    val taskExecutorsIds: Set<Long>, // Receba apenas os IDs dos executores

    @field:NotNull
    val taskEvaluatorsIds: Set<Long>, // Receba apenas os IDs dos avaliadores

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

    val obs: String? = null,

    val assessmentPhoto0: String? = null,

    val assessmentPhoto1: String? = null,

    val assessmentPhoto2: String? = null,

    val assessmentPhoto3: String? = null,

    val assessmentPhoto4: String? = null,

    val assessmentPhoto5: String? = null,

    val isReassessment: Boolean = false
) {
    fun toAssessment(
        task: Task,
        taskExecutors: Set<User>,
        taskEvaluators: Set<User>
    ): Assessment {
        return Assessment(
            task = task,
            taskExecutors = taskExecutors.toMutableSet(),  // Usa toMutableSet() para criar o MutableSet
            taskEvaluators = taskEvaluators.toMutableSet(),  // Usa toMutableSet() para criar o MutableSet
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
            obs = obs,
            assessmentPhoto0 = assessmentPhoto0,
            assessmentPhoto1 = assessmentPhoto1,
            assessmentPhoto2 = assessmentPhoto2,
            assessmentPhoto3 = assessmentPhoto3,
            assessmentPhoto4 = assessmentPhoto4,
            assessmentPhoto5 = assessmentPhoto5,
            isReassessment = isReassessment
        )
    }
}
