package com.br.asbuilt.unitMeasurement

import com.br.asbuilt.exception.BadRequestException
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class UnitMeasurementService(
    val repository: UnitMeasurementRepository) {
    fun insert(unity: UnitMeasurement): UnitMeasurement {
        if (repository.findByName(unity.name) != null) {
            throw BadRequestException("Unit Measurement already exists")
        }
        return repository.save(unity)
            .also { log.info("Unit Measurement inserted: {}", unity.name) }
    }

    fun findAll(): List<UnitMeasurement> = repository.findAll(Sort.by("name").ascending())

    companion object {
        private val log = LoggerFactory.getLogger(UnitMeasurementService::class.java)
    }
}