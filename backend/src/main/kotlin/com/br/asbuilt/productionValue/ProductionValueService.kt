package com.br.asbuilt.productionValue

import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskRepository
import com.br.asbuilt.users.UserRepository
import org.springframework.stereotype.Service

@Service
class ProductionValueService(
    val repository: ProductionValueRepository,
    val userRepository: UserRepository,
    val taskRepository: TaskRepository
) {
    fun insert(productionValue: ProductionValue): ProductionValue {
        val user = userRepository.findById(productionValue.user.id!!)
            .orElseThrow { NotFoundException("User not found with ID: ${productionValue.user.id}") }

        val task = taskRepository.findById(productionValue.task.id!!)
            .orElseThrow { NotFoundException("Task not found with ID: ${productionValue.task.id}") }

        productionValue.user = user
        productionValue.task = task

        return repository.save(productionValue)
    }
}