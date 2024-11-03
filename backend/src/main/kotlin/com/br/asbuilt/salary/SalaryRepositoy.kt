package com.br.asbuilt.salary

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SalaryRepositoy : JpaRepository<Salary, Long> {
}