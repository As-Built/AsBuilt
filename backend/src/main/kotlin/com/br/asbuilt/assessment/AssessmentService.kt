package com.br.asbuilt.assessment

import com.br.asbuilt.assessment.controller.requests.CreateAssessmentRequest
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
    fun insert(assessmentRequest: CreateAssessmentRequest): Assessment {
        // Busca a Task pelo ID
        val task = taskRepository.findById(assessmentRequest.taskId)
            .orElseThrow { NotFoundException("Task not found with ID: ${assessmentRequest.taskId}") }

        // Busca os Users (Executores) pelos IDs fornecidos
        val taskExecutors = userRepository.findAllById(assessmentRequest.taskExecutorsIds).toSet()
        if (taskExecutors.size != assessmentRequest.taskExecutorsIds.size) {
            throw NotFoundException("One or more Executors not found with provided IDs")
        }

        // Busca os Users (Avaliadores) pelos IDs fornecidos
        val taskEvaluators = userRepository.findAllById(assessmentRequest.taskEvaluatorsIds).toSet()
        if (taskEvaluators.size != assessmentRequest.taskEvaluatorsIds.size) {
            throw NotFoundException("One or more Evaluators not found with provided IDs")
        }

        // Cria o Assessment usando os objetos buscados
        val newAssessment = assessmentRequest.toAssessment(
            task = task,
            taskExecutors = taskExecutors,
            taskEvaluators = taskEvaluators
        )

        // Atualiza as propriedades startDate e finalDate da Task
        task.startDate = newAssessment.task!!.startDate
        task.finalDate = newAssessment.task!!.finalDate

        // Atualiza a task com as datas de início e fim reais conforme o Assessment
        taskRepository.save(task)

        return repository.save(newAssessment)
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

    fun reassessment(assessmentRequest: CreateAssessmentRequest): Assessment {
        // Busca a Task pelo ID
        val task = taskRepository.findById(assessmentRequest.taskId)
            .orElseThrow { NotFoundException("Task not found with ID: ${assessmentRequest.taskId}") }

        // Busca os Users (Executores) pelos IDs fornecidos
        val taskExecutors = userRepository.findAllById(assessmentRequest.taskExecutorsIds).toSet()
        if (taskExecutors.size != assessmentRequest.taskExecutorsIds.size) {
            throw NotFoundException("One or more Executors not found with provided IDs")
        }

        // Busca os Users (Avaliadores) pelos IDs fornecidos
        val taskEvaluators = userRepository.findAllById(assessmentRequest.taskEvaluatorsIds).toSet()
        if (taskEvaluators.size != assessmentRequest.taskEvaluatorsIds.size) {
            throw NotFoundException("One or more Evaluators not found with provided IDs")
        }

        // Cria o Assessment usando os objetos buscados
        val newAssessment = assessmentRequest.toAssessment(
            task = task,
            taskExecutors = taskExecutors,
            taskEvaluators = taskEvaluators
        )

        return repository.save(newAssessment)
            .also { log.info("Reassessment inserted: {}", it.id) }
    }

    companion object {
        private val log = LoggerFactory.getLogger(AssessmentService::class.java)
    }
}