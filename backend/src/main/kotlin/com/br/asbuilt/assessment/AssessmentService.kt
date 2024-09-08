package com.br.asbuilt.assessment

import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.tasks.TaskRepository
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class AssessmentService(
    val repository: AssessmentRepository,
    val taskRepository: TaskRepository,
    val userRepository: UserRepository
) {
    fun insert(assessment: Assessment): Assessment {
        val task = assessment.task?.let {
            taskRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Task not found with ID: ${it.id}") }
        }

        if (task == null) {
            throw NotFoundException("Task not found!")
        }

        val taskExecutors = assessment.taskExecutors.map {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Executor not found with ID: ${it.id}") }
        }

        if (taskExecutors.isEmpty()) {
            throw NotFoundException("Executor not found!")
        }

        val taskEvaluator = assessment.taskEvaluators.map {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Evaluator not found with ID: ${it.id}") }
        }

        if (taskEvaluator.isEmpty()) {
            throw NotFoundException("Evaluator not found!")
        }

        return repository.save(assessment)
            .also { log.info("Assessment inserted: {}", it.id) }
    }

    fun findTasksWithoutAssessment(): List<Task> {
        return repository.findTasksWithoutAssessment()
    }

    fun findTasksWithtAssessmentCompleted(): List<Task> {
        return repository.findTasksWithtAssessmentCompleted()
    }

    fun findTasksNeedReassessment(): List<Task> {
        return repository.findTasksNeedReassessment()
    }

    fun reassessment(assessment: Assessment): Assessment? {
        val task = assessment.task?.let {
            taskRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Task not found with ID: ${it.id}") }
        }

        if (task == null) {
            throw NotFoundException("Task not found!")
        }

        val taskExecutors = assessment.taskExecutors.map {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Executor not found with ID: ${it.id}") }
        }

        if (taskExecutors.isEmpty()) {
            throw NotFoundException("Executor not found!")
        }

        val taskEvaluator = assessment.taskEvaluators.map {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Evaluator not found with ID: ${it.id}") }
        }

        if (taskEvaluator.isEmpty()) {
            throw NotFoundException("Evaluator not found!")
        }

        return repository.save(assessment)
            .also { log.info("Assessment reevaluated: {}", it.id) }
    }

    companion object {
        private val log = LoggerFactory.getLogger(AssessmentService::class.java)
    }
}