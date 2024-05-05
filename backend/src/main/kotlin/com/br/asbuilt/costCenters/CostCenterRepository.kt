package com.br.asbuilt.costCenters

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface CostCenterRepository : JpaRepository<CostCenter, Long> {

    @Query("select distinct c from CostCenter c where c.costCenterName = :costCenterName")
    fun findCostCenterByName(costCenterName: String): CostCenter?

    @Transactional
    @Modifying
    @Query("update CostCenter c set c.valueUndertaken = c.valueUndertaken - :amount where c.id = :costCenterId")
    fun decreaseValueUndertaken(costCenterId: Long, amount: Double): Int

}