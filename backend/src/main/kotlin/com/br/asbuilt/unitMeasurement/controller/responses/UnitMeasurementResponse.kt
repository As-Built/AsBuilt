package com.br.asbuilt.unitMeasurement.controller.responses

import com.br.asbuilt.unitMeasurement.UnitMeasurement

data class UnitMeasurementResponse(
    val id: Long,
    val name: String,
    val description: String,
) {
    constructor(unitMeasurement: UnitMeasurement) : this(
        id = unitMeasurement.id!!,
        name = unitMeasurement.name,
        description = unitMeasurement.description
    )
}
