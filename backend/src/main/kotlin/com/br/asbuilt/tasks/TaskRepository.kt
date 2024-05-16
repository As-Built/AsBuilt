package com.br.asbuilt.tasks

import com.br.asbuilt.costCenters.CostCenter
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Sort

@Repository
interface TaskRepository : JpaRepository <Task, Long> {

    @Query("SELECT DISTINCT t " +
            "FROM Task t " +
            "JOIN t.conferente c " +
            "JOIN t.executor e " +
            "WHERE UPPER(c.name) LIKE UPPER(CONCAT('%', :userName, '%')) OR UPPER(e.name) LIKE UPPER(CONCAT('%', :userName, '%'))")
    fun findByUserName(@Param("userName") userName: String, sort: Sort): List<Task>

    @Query("SELECT t FROM Task t WHERE t.costCenter.id = :costCenterId")
    fun findTasksByCostCenterId(costCenterId: Long): List<Task>

    @Query("SELECT t FROM Task t WHERE t.taskLocation.id = :locationId")
    fun findTasksByLocationId(locationId: Long): List<Task>
}