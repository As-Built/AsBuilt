package com.br.asbuilt.taskTypes

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface TaskTypeRepository : JpaRepository<TaskType, Long> {

    @Query("SELECT t FROM TaskType t WHERE t.taskTypeName = :taskTypeName")
    fun findTaskTypeByName (taskTypeName: String): TaskType?
}