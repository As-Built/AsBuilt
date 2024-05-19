package com.br.asbuilt.unitMeasurement

import org.springframework.data.jpa.repository.JpaRepository

interface UnitMeasurementRepository : JpaRepository<UnitMeasurement, Long> {
    fun findByName(name: String): UnitMeasurement?
}