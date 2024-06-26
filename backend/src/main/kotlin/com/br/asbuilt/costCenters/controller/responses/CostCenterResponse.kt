package com.br.asbuilt.costCenters.controller.responses

import com.br.asbuilt.address.Address
import com.br.asbuilt.builders.Builder
import com.br.asbuilt.costCenters.CostCenter

data class CostCenterResponse(
    val id: Long?,
    val costCenterName: String,
    val costCenterAddress: Address,
    val valueUndertaken: Double,
    val expectedBudget: Double,
    val builder: Builder
) {
    constructor(costCenter: CostCenter) : this (
        costCenter.id!!,
        costCenter.costCenterName,
        costCenter.costCenterAddress,
        costCenter.valueUndertaken,
        costCenter.expectedBudget,
        costCenter.builder
    )
}
