package com.br.asbuilt.salary.controller.responses

import com.br.asbuilt.salary.Salary
import com.br.asbuilt.users.controller.responses.UserResponse
import java.util.*

data class SalaryResponse(
    val id: Long?,
    val value: Double,
    val updateDate: Date,
) {
    constructor(salary: Salary) : this(
        salary.id!!,
        salary.value,
        salary.updateDate,
    )
}
