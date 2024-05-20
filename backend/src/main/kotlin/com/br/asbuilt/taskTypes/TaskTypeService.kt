package com.br.asbuilt.taskTypes

import com.br.asbuilt.SortDir
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class TaskTypeService (
    val repository: TaskTypeRepository,
    val taskRepository: TaskRepository
) {

    fun insert(taskType: TaskType): TaskType {
        val existingTaskType = repository.findTaskTypeByName(
            taskType.taskTypeName
        )

        if (existingTaskType != null) {
            throw BadRequestException("TaskType already exists")
        }

        return repository.save(taskType)
            .also { log.info("TaskType inserted: {}", it.id) }
    }

    fun updateTaskType(taskType: TaskType): TaskType? {
        val existingTaskType = taskType.id!!.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("TaskType not found with id: ${taskType.id}") }
        }

        var isChanged = false

        if (existingTaskType != null) {

            if (taskType.taskTypeName != existingTaskType.taskTypeName) {
                existingTaskType.taskTypeName = taskType.taskTypeName
                isChanged = true
            }

            if (taskType.taskTypeDescription != existingTaskType.taskTypeDescription) {
                existingTaskType.taskTypeDescription = taskType.taskTypeDescription
                isChanged = true
            }

            if (taskType.unitMeasurement.id != existingTaskType.unitMeasurement.id) {
                existingTaskType.unitMeasurement = taskType.unitMeasurement
                isChanged = true
            }

            //Como são vários parâmetros de semelhantes, foi criado um loop para percorrer todos os parâmetros
            for (i in 0..9) {
                val parameterNameField = TaskType::class.java.getDeclaredField("parameter${i}Name")
                parameterNameField.isAccessible = true

                val parameterResultField = TaskType::class.java.getDeclaredField("parameter${i}Result")
                parameterResultField.isAccessible = true

                val taskTypeParameterName = parameterNameField.get(taskType) as? String
                val existingTaskTypeParameterName = parameterNameField.get(existingTaskType) as? String

                val taskTypeParameterResult = parameterResultField.get(taskType) as? Boolean
                val existingTaskTypeParameterResult = parameterResultField.get(existingTaskType) as? Boolean

                if (taskTypeParameterName != existingTaskTypeParameterName) {
                    parameterNameField.set(existingTaskType, taskTypeParameterName)
                    isChanged = true
                }

                if (taskTypeParameterResult != existingTaskTypeParameterResult) {
                    parameterResultField.set(existingTaskType, taskTypeParameterResult)
                    isChanged = true
                }
            }
            if (taskType.comments != existingTaskType.comments) {
                existingTaskType.comments = taskType.comments
                isChanged = true
            }

            if (isChanged) {
                return repository.save(existingTaskType)
                    .also { log.info("TaskType updated: {}", it.id) }
            } else {
                throw BadRequestException("No changes detected! TaskType not updated!")
                    .also { log.info("TaskType not updated (nothing changed): {}", taskType.id) }
            }
        } else {
            throw BadRequestException("TaskType not found!")
            .also { log.info("TaskType not found with id: ${taskType.id}") }
        }
    }

    fun findAll(dir: SortDir = SortDir.ASC): List<TaskType> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("taskTypeName").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("taskTypeName").descending())
    }

    fun delete(id: Long): Boolean {
        if (repository.existsById(id)) {
            val tasksRelated = taskRepository.findTasksByTaskTypeId(id)
            if (tasksRelated.isNotEmpty()) {
                throw BadRequestException("TaskType has related tasks! Cannot delete!")
                    .also { log.info("TaskType has related tasks! Cannot delete: {}", id) }
            } else {
                repository.deleteById(id)
                    .also { log.info("TaskType deleted: {}", id) }
                return true
            }
        } else {
            throw BadRequestException("TaskType not found!")
                .also { log.info("TaskType not found with id: {}", id) }
        }
    }

    companion object {
        private val log = LoggerFactory.getLogger(TaskTypeService::class.java)
    }

}