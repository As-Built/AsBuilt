package com.br.asbuilt.assessment.controller

import com.br.asbuilt.assessment.AssessmentService
import com.br.asbuilt.assessment.controller.requests.CreateAssessmentRequest
import com.br.asbuilt.assessment.controller.responses.AssessmentResponse
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
@RequestMapping("/assessment")
class AssessmentController(
    val service: AssessmentService,
    val taskService: TaskService,
    val userService: UserService
) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertAssessment")
    fun insert(@Valid @RequestBody assessment: CreateAssessmentRequest): ResponseEntity<AssessmentResponse> {
        val task = assessment.task.let {
            taskService.findByIdOrNull(assessment.task.id!!)
        } ?: throw NotFoundException("Task not found!")

        val executors = assessment.taskExecutors.mapNotNull {
            userService.findByIdOrNull(it.id!!)
        }

        if (executors.isEmpty()) {
            throw NotFoundException("Task executors not found!")
        }

        val taskEvaluator = assessment.taskEvaluator.let {
            userService.findByIdOrNull(it.id!!)
        } ?: throw NotFoundException("Task evaluator not found!")

        val assessmentEntity = assessment.toAssessment()

        assessmentEntity.task = task
        assessmentEntity.taskExecutors = executors.toMutableList()
        assessmentEntity.taskEvaluator = taskEvaluator

        return AssessmentResponse(service.insert(assessmentEntity))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }
    }
}