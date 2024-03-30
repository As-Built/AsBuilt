package com.br.asbuilt.costCenters.controller.requests

import jakarta.validation.constraints.NotBlank

data class PatchCostCenterNameResquest(
    @field:NotBlank
    val nomeCentroDeCusto: String
)
