package com.br.asbuilt.unitMeasurement.controller

import com.br.asbuilt.unitMeasurement.UnitMeasurementService
import com.br.asbuilt.unitMeasurement.controller.requests.CreateUnitMeasurementRequest
import com.br.asbuilt.unitMeasurement.controller.responses.UnitMeasurementResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/unitMeasurement")
class UnitMeasurementController(val service: UnitMeasurementService) {

    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertUnitMeasurement")
    fun insert(@Valid @RequestBody unitMeasurement: CreateUnitMeasurementRequest) =
        UnitMeasurementResponse(service.insert(unitMeasurement.toUnitMeasurement()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @GetMapping
    fun list() =
        service.findAll()
            .map { UnitMeasurementResponse(it) }
            .let { ResponseEntity.ok(it) }

}