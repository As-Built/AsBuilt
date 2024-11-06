package com.br.asbuilt.productionValue

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ProductionValueRepository : JpaRepository<ProductionValue, Long> {

    @Query("SELECT pv FROM ProductionValue pv WHERE pv.assessment.id = :assessmentId")
    fun findByAssessmentId(assessmentId: Long): List<ProductionValue>

    @Query("SELECT pv FROM ProductionValue pv " +
            "WHERE MONTH(pv.date) = :month " +
            "AND pv.user.id = :userId")
    fun findByMonthAndUser(month: Int, userId: Long): List<ProductionValue>

    @Query("SELECT pv FROM ProductionValue pv " +
            "WHERE pv.user.id = :userId")
    fun findByUserId(userId: Long): List<ProductionValue>

    @Query("SELECT pv FROM ProductionValue pv " +
            "WHERE MONTH(pv.date) = :month")
    fun findByMonth(month: Int): List<ProductionValue>

    @Query("SELECT pv FROM ProductionValue pv " +
            "WHERE pv.date BETWEEN :startDate AND :endDate")
    fun findByPeriod(startDate: Date, endDate: Date): List<ProductionValue>

    @Query("SELECT pv FROM ProductionValue pv " +
            "WHERE pv.user.id = :userId " +
            "AND pv.date BETWEEN :startDate AND :endDate")
    fun findByPeriodAndUserId(startDate: Date, endDate: Date, userId: Long): List<ProductionValue>
}