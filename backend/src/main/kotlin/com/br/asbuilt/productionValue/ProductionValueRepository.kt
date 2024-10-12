package com.br.asbuilt.productionValue

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ProductionValueRepository : JpaRepository<ProductionValue, Long> {

    @Query("SELECT pv FROM ProductionValue pv WHERE pv.assessment.id = :assessmentId")
    fun findByAssessmentId(assessmentId: Long): List<ProductionValue>

}