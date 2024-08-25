package com.br.asbuilt.appraisal.controller.requests

import com.br.asbuilt.appraisal.Appraisal
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import jakarta.validation.constraints.NotNull
import java.util.*

data class CreateAppraisalRequest(
    @field:NotNull
    val task: Task,

    @field:NotNull
    val taskExecutors: List<User>,

    @field:NotNull
    val tasklecturer: User,

    @field:NotNull
    val appraisalDate: Date,

    @field:NotNull
    val appraisalResult: Boolean,

    val obs: String? = null

    ) {
    fun toAppraisal() = Appraisal(
        task = task,
        taskExecutors = taskExecutors.toMutableList(),
        tasklecturer = tasklecturer,
        appraisalDate = appraisalDate,
        appraisalResult = appraisalResult,
        obs = obs
    )
}
