package com.br.asbuilt.appraisal.controller.responses

import com.br.asbuilt.appraisal.Appraisal
import com.br.asbuilt.tasks.controller.responses.TaskResponse
import com.br.asbuilt.users.controller.responses.UserResponse
import java.util.*

data class AppraisalResponse(
    val id: Long?,
    val task: TaskResponse,
    val taskExecutors: List<UserResponse>,
    val tasklecturer: UserResponse,
    val appraisalDate: Date,
    val appraisalResult: Boolean
) {
    constructor(appraisal: Appraisal) : this(
        appraisal.id,
        appraisal.task?.let { TaskResponse(it) }!!,
        appraisal.taskExecutors.map { UserResponse(it) },
        UserResponse(appraisal.tasklecturer),
        appraisal.appraisalDate,
        appraisal.appraisalResult!!
    )
}
