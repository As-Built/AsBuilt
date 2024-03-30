package com.br.asbuilt.costCenters.controller.requests

import jakarta.validation.constraints.NotBlank

data class PatchCostCenterAdressRequest(
    @field:NotBlank
    val enderecoCentroDeCusto: String
)
