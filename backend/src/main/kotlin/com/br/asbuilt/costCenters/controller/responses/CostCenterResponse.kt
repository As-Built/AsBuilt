package com.br.asbuilt.costCenters.controller.responses

import com.br.asbuilt.address.Address
import com.br.asbuilt.costCenters.CostCenter

data class CostCenterResponse(
    val id: Long?,
    val nomeCentroDeCusto: String,
    val enderecoCentroDeCusto: Address,
    val valorEmpreendido: Double
) {
    constructor(costCenter: CostCenter) : this (
        costCenter.id!!,
        costCenter.nomeCentroDeCusto,
        costCenter.enderecoCentroDeCusto,
        costCenter.valorEmpreendido
    )
}
