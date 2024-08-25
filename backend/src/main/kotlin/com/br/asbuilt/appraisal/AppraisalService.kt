package com.br.asbuilt.appraisal

import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskRepository
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class AppraisalService(
    val repository: AppraisalRepository,
    val taskRepository: TaskRepository,
    val userRepository: UserRepository
) {
    fun insert(appraisal: Appraisal): Appraisal {
        val task = appraisal.task?.let {
            taskRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Task not found with ID: ${it.id}") }
        }

        if (task == null) {
            throw NotFoundException("Task not found!")
        }

        appraisal.task = task

        val taskExecutors = appraisal.taskExecutors.map {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Executor not found with ID: ${it.id}") }
        }

        appraisal.taskExecutors = taskExecutors.toMutableList()

        val taskLecturer = appraisal.tasklecturer?.let {
            userRepository.findById(it.id!!)
                .orElseThrow { NotFoundException("Lecturer not found with ID: ${it.id}") }
        }

        appraisal.tasklecturer = taskLecturer

        return repository.save(appraisal)
            .also { log.info("Appraisal inserted: {}", it.id) }
    }

    companion object {
        private val log = LoggerFactory.getLogger(AppraisalService::class.java)
    }
}