package com.br.asbuilt.assessment

import com.br.asbuilt.assessment.controller.responses.AssessmentResponse
import com.br.asbuilt.tasks.Task
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface AssessmentRepository : JpaRepository <Assessment, Long> {

    @Query("SELECT t FROM Task t " +
            "WHERE NOT EXISTS " +
                "(SELECT a FROM Assessment a " +
                    "WHERE a.task = t " +
                        "AND a.assessmentResult = TRUE)" +
            "AND t.finalDate IS NULL")
    fun findTasksWithoutAssessment(): List<Task>

    @Query("SELECT t FROM Task t " +
            "INNER JOIN Assessment a ON a.task = t " +
            "WHERE t.startDate IS NOT NULL")
    fun findTasksWithAssessmentCompleted(): List<Task>

    @Query("SELECT t FROM Task t " +
            "WHERE EXISTS " +
                "(SELECT a FROM Assessment a " +
                    "WHERE a.task = t " +
                        "AND a.assessmentResult = FALSE)" +
            "AND t.startDate IS NOT NULL " +
            "AND t.finalDate IS NULL")
    fun findTasksNeedReassessment(): List<Task>

    @Query("SELECT a FROM Assessment a " +
            "WHERE a.task.id = :taskId ")
    fun findAssessmentByTaskId(taskId: Long): Assessment?

    @Query("SELECT a FROM Assessment a " +
            "WHERE a.task.id = :taskId " +
            "ORDER BY a.id ASC")
    fun findAssessmentsByTaskId(taskId: Long): List<Assessment>?

}