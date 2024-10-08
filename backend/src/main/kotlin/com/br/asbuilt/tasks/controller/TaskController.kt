package com.br.asbuilt.tasks.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.costCenters.CostCenterService
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskService
import com.br.asbuilt.tasks.controller.requests.CreateTaskRequest
import com.br.asbuilt.tasks.controller.requests.PatchTaskRequest
import com.br.asbuilt.tasks.controller.responses.TaskResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tasks")
class TaskController(
    val service: TaskService,
    val costCenterService: CostCenterService) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertTask")
    fun insert(
        @Valid
        @RequestBody task: CreateTaskRequest) =

//        val centroDeCusto = task.costCenter.let {
//            costCenterService.findByIdOrNull(task.costCenter.id!!)
//        } ?: throw NotFoundException("Cost Center not found!")
//
//        val taskEntity = task.toTask()
//
//        taskEntity.costCenter = centroDeCusto
//
//        val location = task.taskLocation.let {
//            service.locationRepository.findById(task.taskLocation.id!!)
//        }.orElseThrow { NotFoundException("Location not found!") }
//
//        taskEntity.taskLocation = location

        TaskResponse(service.insert(task.toTask()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }
//    }


    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PatchMapping("/updateTask")
    fun updateTask(@Valid @RequestBody request: PatchTaskRequest) =
        TaskResponse(service.updateTask(request.toTask())!!)
            .let{ ResponseEntity.status(HttpStatus.OK).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/listTasks")
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
            .map { TaskResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @DeleteMapping("/deleteTask/{idTask}")
    fun delete(@PathVariable idTask: Long): ResponseEntity<Void> =
        if (service.delete(idTask)){
            ResponseEntity.ok().build()
        }
        else ResponseEntity.notFound().build()

    @SecurityRequirement(name = "AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findByUserName/{userName}")
    fun findByUsername(
        @PathVariable userName: String,
        @RequestParam(defaultValue = "ASC") sortDir: SortDir
    ): ResponseEntity<List<TaskResponse>> {
        val sortDirString = sortDir.name // Convertendo SortDir para String
        return service.findByUserName(userName, sortDirString)
            .map { TaskResponse(it) }
            .let { ResponseEntity.ok(it) }
    }


}