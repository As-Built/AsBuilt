package com.br.asbuilt.assessment

import com.br.asbuilt.tasks.Task
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface AssessmentRepository : JpaRepository <Assessment, Long> {

    @Query("SELECT t FROM Task t " +
            "WHERE NOT EXISTS " +
                "(SELECT a FROM Assessment a " +
                    "WHERE a.task = t " +
                        "AND a.assessmentResult IS FALSE " +
                        "AND a.isReassessment IS FALSE) " +
            "AND t.finalDate IS NULL ")
    fun findTasksWithoutAssessment(): List<Task>

    @Query("SELECT t FROM Task t " +
            "INNER JOIN Assessment a ON a.task = t " +
            "WHERE a.assessmentResult IS TRUE " +
                "AND a.isReassessment IS FALSE " +
                "AND t.finalDate IS NOT NULL ")
    fun findTasksWithtAssessmentCompleted(): List<Task>

    @Query("SELECT t FROM Task t " +
            "INNER JOIN Assessment a ON a.task = t " +
            "WHERE a.assessmentResult IS FALSE " +
                "AND a.isReassessment IS TRUE " +
                "AND t.finalDate IS NULL ")
    fun findTasksNeedReassessment(): List<Task>

}