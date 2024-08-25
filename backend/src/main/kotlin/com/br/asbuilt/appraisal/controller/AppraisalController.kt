package com.br.asbuilt.appraisal.controller

import com.br.asbuilt.appraisal.AppraisalService
import com.br.asbuilt.appraisal.controller.requests.CreateAppraisalRequest
import com.br.asbuilt.appraisal.controller.responses.AppraisalResponse
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskService
import com.br.asbuilt.users.UserService
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/appraisal")
class AppraisalController(
    val service: AppraisalService,
    val taskService: TaskService,
    val userService: UserService
) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertAppraisal")
    fun insert(@Valid @RequestBody appraisal: CreateAppraisalRequest): ResponseEntity<AppraisalResponse> {
        val task = appraisal.task.let {
            taskService.findByIdOrNull(appraisal.task.id!!)
        } ?: throw NotFoundException("Task not found!")

        val executors = appraisal.taskExecutors.mapNotNull {
            userService.findByIdOrNull(it.id!!)
        }

        if (executors.isEmpty()) {
            throw NotFoundException("Task executors not found!")
        }

        val taskLecturer = appraisal.tasklecturer.let {
            userService.findByIdOrNull(it.id!!)
        } ?: throw NotFoundException("Task lecturer not found!")

        val appraisalEntity = appraisal.toAppraisal()

        appraisalEntity.task = task
        appraisalEntity.taskExecutors = executors.toMutableList()
        appraisalEntity.tasklecturer = taskLecturer

        return AppraisalResponse(service.insert(appraisalEntity))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }
    }
}