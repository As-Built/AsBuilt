package com.br.asbuilt.tasks

import com.br.asbuilt.SortDir
import com.br.asbuilt.costCenters.CostCenterRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.locations.LocationRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class TaskService (
    val repository: TaskRepository,
    val costCenterRepository: CostCenterRepository,
    val locationRepository: LocationRepository
) {

    fun insert(task: Task): Task {
        val existingTask = repository.existsTask(
            task.costCenter.id!!,
            task.taskType.id!!,
            task.taskLocation.locationGroup,
            task.taskLocation.subGroup1,
            task.taskLocation.subGroup2,
            task.taskLocation.subGroup3
        )

        if (existingTask != null) {
            throw BadRequestException("Task already exists")
        }

        val centroDeCustoId = task.costCenter.id

        val centroDeCusto = centroDeCustoId?.let {
            costCenterRepository.findById(it)
                .orElseThrow { NotFoundException("Cost center not found with ID: $centroDeCustoId") }
        }

        if (centroDeCusto == null) {
            throw NotFoundException("Cost center not found!")
        }

        task.costCenter = centroDeCusto

        if (task.taskLocation.subGroup1 == "") {
            task.taskLocation.subGroup1 = null
        }

        if (task.taskLocation.subGroup2 == "") {
            task.taskLocation.subGroup2 = null
        }

        if (task.taskLocation.subGroup3 == "") {
            task.taskLocation.subGroup3 = null
        }

        val locationId = locationRepository.findLocationId(
            task.costCenter.id!!,
            task.taskLocation.locationGroup,
            task.taskLocation.subGroup1,
            task.taskLocation.subGroup2,
            task.taskLocation.subGroup3
        )

        val location = locationId?.let {
            locationRepository.findById(it)
                .orElseThrow { NotFoundException("Location not found with ID: $locationId") }
        }

        if (location == null) {
            throw NotFoundException("Location not found!")
        }

        task.taskLocation = location

        return repository.save(task)
            .also{ log.info("Task inserted: {}", it.id) }
    }

    fun updateTask(request: Task): Task? {
        val existingTask = request.id!!.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("Task not found!") }
                .also { log.info("Task not found with id: ${request.id}") }
        }

        if (existingTask != request) {
                return repository.save(request)
                    .also { log.info("Task updated: {}", it.id) }
        } else {
            throw BadRequestException("No changes detected! Task not updated!")
                .also { log.info("Task not updated (nothing changed): {}", request.id) }
        }
    }

    fun findAll(dir: SortDir = SortDir.ASC): List<Task> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("expectedStartDate").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("expectedStartDate").descending())
    }

    fun delete(idTask: Long): Boolean {
        val task = repository.findByIdOrNull(idTask) ?: return false
        // TODO: Implementar condição que verifica se existem avaliações relacionadas ao serviço
        repository.delete(task)
        log.info("Task deleted: {}", task.id)
        return true
    }

    fun findByUserName(userName: String, sortDir: String?): List<Task> {
        val sort = if (sortDir == "DESC") Sort.by(Sort.Order.desc("id")) else Sort.by(Sort.Order.asc("id"))
        return repository.findByUserName(userName, sort)
    }

    fun findByIdOrNull(id: Long): Task? = repository.findByIdOrNull(id)

    companion object {
        private val log = LoggerFactory.getLogger(TaskService::class.java)
    }
}