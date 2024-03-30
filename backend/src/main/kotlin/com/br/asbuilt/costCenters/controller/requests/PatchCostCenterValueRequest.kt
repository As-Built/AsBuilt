package com.br.asbuilt.costCenters.controller.requests

import jakarta.validation.constraints.NotNull

data class PatchCostCenterValueRequest(
    @field: NotNull
    val valorEmpreendido: Double
)
