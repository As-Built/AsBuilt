package com.br.asbuilt.locations.controller.responses

import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.locations.Location

data class LocationResponse(
    val id: Long?,
    val costCenter: CostCenter,
    val locationGroup: String,
    val subGroup1: String?,
    val subGroup2: String?,
    val subGroup3: String?
) {
    constructor(location: Location) : this (
        location.id!!,
        location.costCenter,
        location.locationGroup,
        location.subGroup1,
        location.subGroup2,
        location.subGroup3
    )
}
