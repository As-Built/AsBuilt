package com.br.asbuilt.costCenters.controller.requests

import com.br.asbuilt.address.Address
import com.br.asbuilt.builder.Builder
import com.br.asbuilt.costCenters.CostCenter
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class CreateCostCenterRequest(
    @field: NotBlank
    val costCenterName: String,

    @field: NotNull
    val costCenterAddress: Address,

    @field: NotNull
    val valueUndertaken: Double,

    @field: NotNull
    val expectedBudget: Double,

    @field: NotNull
    val builder: Builder
) {
    fun toCostCenter() = CostCenter(
        costCenterName = costCenterName,
        costCenterAddress = costCenterAddress,
        valueUndertaken = valueUndertaken,
        expectedBudget = expectedBudget,
        builder = builder
    )
}
