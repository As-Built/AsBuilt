package com.br.asbuilt.costCenters.controller.requests

import com.br.asbuilt.address.Address
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
    @field: NotBlank
    val owner: String
) {
    fun toCostCenter() = CostCenter(
        costCenterName = costCenterName,
        costCenterAddress = costCenterAddress,
        valueUndertaken = valueUndertaken,
        owner = owner
    )
}
