package com.br.asbuilt.costCenters.controller.requests

import com.br.asbuilt.address.Address
import jakarta.validation.constraints.NotBlank

data class PatchCostCenterAddressRequest(
    @field:NotBlank
    val costCenterAddress: Address
)
