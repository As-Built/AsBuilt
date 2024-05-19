package com.br.asbuilt.tasks.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.costCenters.CostCenterService
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskService
import com.br.asbuilt.tasks.controller.requests.CreateTaskRequest
import com.br.asbuilt.tasks.controller.requests.PatchTaskRequest
import com.br.asbuilt.tasks.controller.responses.TaskResponse
import com.br.asbuilt.users.UserService
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tasks")
class TaskController(val service: TaskService, val userService: UserService, val costCenterService: CostCenterService) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/insertTask")
    fun insert(
        @Valid
        @RequestBody task: CreateTaskRequest): ResponseEntity<TaskResponse> {

        val centroDeCusto = task.costCenter.let {
            costCenterService.findByIdOrNull(task.costCenter.id!!)
        } ?: throw NotFoundException("Cost Center not found!")

        val taskEntity = task.toTask()

        taskEntity.costCenter = centroDeCusto

        //Adiciona o valor do serviço ao valor empreendido no centro de custo
        costCenterService.increaseValueUndertaken(centroDeCusto.id!!, taskEntity.amount)

        return TaskResponse(service.insert(taskEntity))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }
    }


    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    fun update(
        @Valid
        @RequestBody request: PatchTaskRequest,
        @PathVariable id: Long,
    ): ResponseEntity <TaskResponse> {
        val centroDeCusto = request.costCenter.let {
            costCenterService.findByIdOrNull(request.costCenter.id!!)
        } ?: throw NotFoundException("Cost Center not found!")

        val executor = request.executor?.mapNotNull { userService.findByIdOrNull(it) }
        val conferente = request.conferente?.mapNotNull { userService.findByIdOrNull(it) }
        val taskEntity = request.toTask()

        taskEntity.costCenter = centroDeCusto
        taskEntity.costCenter = centroDeCusto
        if (executor != null) {
            taskEntity.executor.addAll(executor)
        }
        if (conferente != null) {
            taskEntity.conferente.addAll(conferente)
        }
        val taskAntiga = service.findByIdOrNull(id)

        //Remove o valor anterior do serviço aplicado ao centro de custo e depois adiciona o valor novo
        if (taskAntiga != null) {
            costCenterService.decreaseValueUndertaken(id, taskAntiga.amount)
            costCenterService.increaseValueUndertaken(id, taskEntity.amount)
        }

        return service.update(id, taskEntity)
            ?.let{ ResponseEntity.ok(TaskResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
            .map { TaskResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
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
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }


}