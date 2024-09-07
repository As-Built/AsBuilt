package com.br.asbuilt.tasks

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Sort

@Repository
interface TaskRepository : JpaRepository <Task, Long> {

    @Query("SELECT DISTINCT t " +
            "FROM Task t " +
            "JOIN t.evaluators ev " +
            "JOIN t.executors ex " +
            "WHERE UPPER(ev.name) LIKE UPPER(CONCAT('%', :userName, '%')) OR UPPER(ex.name) LIKE UPPER(CONCAT('%', :userName, '%'))")
    fun findByUserName(@Param("userName") userName: String, sort: Sort): List<Task>

    @Query("SELECT t FROM Task t WHERE t.costCenter.id = :costCenterId")
    fun findTasksByCostCenterId(costCenterId: Long): List<Task>

    @Query("SELECT t FROM Task t WHERE t.taskLocation.id = :locationId")
    fun findTasksByLocationId(locationId: Long): List<Task>

    @Query("SELECT t FROM Task t WHERE t.taskType.id = :taskTypeId")
    fun findTasksByTaskTypeId(taskTypeId: Long): List<Task>

    @Query("SELECT t FROM Task t " +
            "WHERE t.costCenter.id = :costCenterId " +
            "AND t.taskType.id = :taskTypeId " +
            "AND t.taskLocation.locationGroup = :locationGroup " +
            "AND (:subGroup1 IS NULL OR t.taskLocation.subGroup1 = :subGroup1) " +
            "AND (:subGroup2 IS NULL OR t.taskLocation.subGroup2 = :subGroup2) " +
            "AND (:subGroup3 IS NULL OR t.taskLocation.subGroup3 = :subGroup3)")
    fun existsTask(@Param("costCenterId") costCenterId: Long,
                   @Param("taskTypeId") taskTypeId: Long,
                       @Param("locationGroup") locationGroup: String,
                       @Param("subGroup1") subGroup1: String?,
                       @Param("subGroup2") subGroup2: String?,
                       @Param("subGroup3") subGroup3: String?): Task?
}