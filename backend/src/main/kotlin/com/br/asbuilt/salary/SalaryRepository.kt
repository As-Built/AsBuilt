package com.br.asbuilt.salary

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface SalaryRepository : JpaRepository<Salary, Long> {

    @Query("SELECT SUM(s.value) FROM Salary s WHERE s.updateDate = (SELECT MAX(s2.updateDate) FROM Salary s2 WHERE s2.user.id = s.user.id)")
    fun sumLatestSalaries(): Double

}