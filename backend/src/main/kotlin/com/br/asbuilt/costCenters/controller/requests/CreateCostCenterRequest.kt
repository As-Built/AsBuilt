package com.br.asbuilt.costCenters.controller.requests

import com.br.asbuilt.address.Address
import com.br.asbuilt.costCenters.CostCenter
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class CreateCostCenterRequest(
    @field: NotBlank
    val nomeCentroDeCusto: String,
    @field: NotNull
    val enderecoCentroDeCusto: Address,
    @field: NotNull
    val valorEmpreendido: Double
) {
    fun toCostCenter() = CostCenter(
        nomeCentroDeCusto = nomeCentroDeCusto,
        enderecoCentroDeCusto = enderecoCentroDeCusto,
        valorEmpreendido = valorEmpreendido
    )
}
