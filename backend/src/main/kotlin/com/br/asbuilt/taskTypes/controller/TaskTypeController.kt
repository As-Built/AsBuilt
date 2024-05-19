package com.br.asbuilt.taskTypes.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.locations.controller.responses.LocationResponse
import com.br.asbuilt.taskTypes.TaskTypeService
import com.br.asbuilt.taskTypes.controller.requests.CreateTaskTypeRequest
import com.br.asbuilt.taskTypes.controller.requests.PatchTaskTypeRequest
import com.br.asbuilt.taskTypes.controller.responses.TaskTypeResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/taskType")
class TaskTypeController(val service: TaskTypeService) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertTaskType")
    fun insert(@Valid @RequestBody taskType: CreateTaskTypeRequest) =
        TaskTypeResponse(service.insert(taskType.toTaskType()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/updateTaskType")
    fun update(@Valid @RequestBody taskType: PatchTaskTypeRequest) =
        TaskTypeResponse(service.insert(taskType.toTaskType()))
            .let { ResponseEntity.status(HttpStatus.OK).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
            .map { TaskTypeResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @DeleteMapping("/deleteTaskType/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        if (service.delete(id)) ResponseEntity.ok().build()
        else ResponseEntity.notFound().build()
}