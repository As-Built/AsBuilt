package com.br.asbuilt.productionValue

import com.br.asbuilt.assessment.AssessmentRepository
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskRepository
import com.br.asbuilt.tasks.TaskService
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ProductionValueService(
    val repository: ProductionValueRepository,
    val userRepository: UserRepository,
    val taskRepository: TaskRepository,
    val assessmentRepository: AssessmentRepository
) {
    fun insert(productionValue: ProductionValue): ProductionValue {
        val user = userRepository.findById(productionValue.user.id!!)
            .orElseThrow { NotFoundException("User not found with ID: ${productionValue.user.id}") }

        val task = taskRepository.findById(productionValue.task.id!!)
            .orElseThrow { NotFoundException("Task not found with ID: ${productionValue.task.id}") }

        productionValue.user = user
        productionValue.task = task

        val assessment = assessmentRepository.findById(productionValue.assessment.id!!)
            .orElseThrow { NotFoundException("Assessment not found with ID: ${productionValue.assessment.id}") }

        productionValue.assessment = assessment

        return repository.save(productionValue)
            .also { log.info("Production Value inserted: {}", it.id) }
    }

    companion object {
        private val log = LoggerFactory.getLogger(ProductionValueService::class.java)
    }
}