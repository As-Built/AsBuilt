package com.br.asbuilt.unitMeasurement.controller.requests

import com.br.asbuilt.unitMeasurement.UnitMeasurement
import jakarta.validation.constraints.NotBlank

data class CreateUnitMeasurementRequest(
    @field:NotBlank
    val name: String,

    @field:NotBlank
    val description: String
) {
    fun toUnitMeasurement() = UnitMeasurement(
        name = name,
        description = description
    )
}
