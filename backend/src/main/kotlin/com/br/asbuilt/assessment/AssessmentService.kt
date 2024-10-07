package com.br.asbuilt.assessment

import com.br.asbuilt.assessment.controller.requests.CreateAssessmentRequest
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.tasks.TaskRepository
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class AssessmentService(
    val repository: AssessmentRepository,
    val taskRepository: TaskRepository,
    val userRepository: UserRepository
) {
    fun insert(assessmentRequest: CreateAssessmentRequest): Assessment {
        // Busca a Task pelo ID
        val task = assessmentRequest.task.id?.let {
            taskRepository.findById(it)
                .orElseThrow { NotFoundException("Task not found with ID: ${assessmentRequest.task.id}") }
        }

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
            task = task!!,
            taskExecutors = taskExecutors,
            taskEvaluators = taskEvaluators
        )

        // Marca a data de início da task independentemente do resultado da avaliação
        task.startDate = assessmentRequest.task.startDate

        if (newAssessment.assessmentResult) {
            // Se o resultado da avaliação for positivo, atualiza a Task para finalizada
            task.finalDate = assessmentRequest.task.finalDate
        }

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
        val task = assessmentRequest.task.id?.let {
            taskRepository.findById(it)
                .orElseThrow { NotFoundException("Task not found with ID: ${assessmentRequest.task.id}") }
        }

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
            task = task!!,
            taskExecutors = taskExecutors,
            taskEvaluators = taskEvaluators
        )

        return repository.save(newAssessment)
            .also { log.info("Reassessment inserted: {}", it.id) }
    }

    fun findAssessmentById(id: Long): Assessment {
        return repository.findByIdOrNull(id) ?: throw NotFoundException("Assessment not found with id: $id")
    }

    fun deleteAssessmentById(id: Long): Assessment {
        return repository.findByIdOrNull(id)?.also {
            // Inicializa a coleção de itens que devem ser carregados para evitar LazyInitializationException
            it.taskExecutors.size
            it.taskEvaluators.size

            // Atualiza a Task conforme o tipo de Assessment antes do delete
            if (!it.isReassessment) {
                // Se não for uma reavaliação, atualiza a Task para não iniciada e não finalizada
                it.task?.startDate = null
                it.task?.finalDate = null
                it.task?.let { itTask -> taskRepository.save(itTask) }
            } else {
                // Caso seja uma reavaliação, atualiza a Task para não finalizada
                it.task?.finalDate = null
                it.task?.let { itTask -> taskRepository.save(itTask) }
            }
            repository.delete(it)
            log.info("Assessment deleted: {}", it.id)
        } ?: throw NotFoundException("Assessment not found with id: $id")
    }

    companion object {
        private val log = LoggerFactory.getLogger(AssessmentService::class.java)
    }
}