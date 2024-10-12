package com.br.asbuilt.productionValue.controller.responses

import com.br.asbuilt.productionValue.ProductionValue
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import java.util.*

data class ProductionValueResponse(
    val id: Long?,
    val value: Double,
    val date: Date,
    val user: User,
    val task: Task
) {
    constructor(productionValue: ProductionValue) : this(
        productionValue.id!!,
        productionValue.value,
        productionValue.date,
        productionValue.user,
        productionValue.task
    )
}
