package com.br.asbuilt.assessment

import com.br.asbuilt.exception.NotFoundException
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

        assessment.task = task

        val taskExecutors = assessment.taskExecutors.map {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Executor not found with ID: ${it.id}") }
        }

        assessment.taskExecutors = taskExecutors.toMutableList()

        val taskEvaluator = assessment.taskEvaluators.map {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Evaluator not found with ID: ${it.id}") }
        }

        assessment.taskEvaluators = taskEvaluator.toMutableList()

        return repository.save(assessment)
            .also { log.info("Assessment inserted: {}", it.id) }
    }

//    fun getServicesWithOutAssessments(): List<Assessment> {
//        return repository.findAll().filter { it.assessmentResult == null }
//    }

    companion object {
        private val log = LoggerFactory.getLogger(AssessmentService::class.java)
    }
}