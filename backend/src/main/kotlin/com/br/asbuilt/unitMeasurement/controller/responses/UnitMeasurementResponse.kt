package com.br.asbuilt.unitMeasurement.controller.responses

import com.br.asbuilt.unitMeasurement.UnitMeasurement

data class UnitMeasurementResponse(
    val name: String,
    val description: String,
) {
    constructor(unitMeasurement: UnitMeasurement) : this(
        name = unitMeasurement.name,
        description = unitMeasurement.description
    )
}
