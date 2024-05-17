package com.br.asbuilt.locations.controller.requests

import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.locations.Location
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class CreateLocationRequest(
    @field:NotNull
    val costCenter: CostCenter,

    @field: NotBlank
    val locationGroup: String,

    val subGroup1: String?,

    val subGroup2: String?,

    val subGroup3: String?
) {
    fun toLocation() = Location(
        costCenter = costCenter,
        locationGroup = locationGroup,
        subGroup1 = subGroup1,
        subGroup2 = subGroup2,
        subGroup3 = subGroup3
    )
}

