package com.br.asbuilt.assessment.controller

import com.br.asbuilt.assessment.AssessmentService
import com.br.asbuilt.assessment.controller.requests.CreateAssessmentRequest
import com.br.asbuilt.assessment.controller.requests.PatchAssessmentRequest
import com.br.asbuilt.assessment.controller.responses.AssessmentResponse
import com.br.asbuilt.tasks.controller.responses.TaskResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/assessment")
class AssessmentController(
    val service: AssessmentService,
) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertAssessment")
    fun insert(@Valid @RequestBody assessment: CreateAssessmentRequest) =
        AssessmentResponse(service.insert(assessment.toAssessment()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findTasksWithoutAssessment")
    fun findTasksWithoutAssessment() =
        service.findTasksWithoutAssessment()
            .map { TaskResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findTasksWithtAssessmentCompleted")
    fun findTasksWithtAssessmentCompleted() =
        service.findTasksWithtAssessmentCompleted()
            .map { TaskResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findTasksNeedReassessment")
    fun findTasksNeedReassessment() =
        service.findTasksNeedReassessment()
            .map { TaskResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/reassessment")
    fun reassessment(@Valid @RequestBody assessment: PatchAssessmentRequest) =
        service.reassessment(assessment.toAssessment())?.let { it ->
            AssessmentResponse(it)
                .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }
        } ?: ResponseEntity.notFound().build()

}