package com.br.asbuilt

import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import com.br.asbuilt.unitMeasurement.UnitMeasurementRepository
import com.br.asbuilt.unitMeasurement.UnitMeasurementService
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.assertions.throwables.shouldThrow
import io.mockk.*
import org.springframework.data.domain.Sort

class UnitMeasurementServiceTest : StringSpec({

    lateinit var unitMeasurementRepository: UnitMeasurementRepository
    lateinit var unitMeasurementService: UnitMeasurementService

    beforeEach {
        unitMeasurementRepository = mockk()
        unitMeasurementService = UnitMeasurementService(unitMeasurementRepository)
    }

    "should insert unit measurement" {
        val unitMeasurement = UnitMeasurement(
            name = "Meter",
            description = "Unit of length"
        )

        every { unitMeasurementRepository.findByName(unitMeasurement.name) } returns null
        every { unitMeasurementRepository.save(unitMeasurement) } returns unitMeasurement

        val savedUnitMeasurement = unitMeasurementService.insert(unitMeasurement)

        savedUnitMeasurement shouldNotBe null
        savedUnitMeasurement shouldBe unitMeasurement
        verify(exactly = 1) { unitMeasurementRepository.findByName(unitMeasurement.name) }
        verify(exactly = 1) { unitMeasurementRepository.save(unitMeasurement) }
    }

    "should throw BadRequestException when unit measurement already exists" {
        val unitMeasurement = UnitMeasurement(
            name = "Meter",
            description = "Unit of length"
        )

        every { unitMeasurementRepository.findByName(unitMeasurement.name) } returns unitMeasurement

        shouldThrow<BadRequestException> {
            unitMeasurementService.insert(unitMeasurement)
        }

        verify(exactly = 1) { unitMeasurementRepository.findByName(unitMeasurement.name) }
        verify(exactly = 0) { unitMeasurementRepository.save(any()) }
    }

    "should find all unit measurements" {
        val unitMeasurement1 = UnitMeasurement(
            name = "Meter",
            description = "Unit of length"
        )
        val unitMeasurement2 = UnitMeasurement(
            name = "Kilogram",
            description = "Unit of mass"
        )

        val unitMeasurementList = listOf(unitMeasurement1, unitMeasurement2)

        every { unitMeasurementRepository.findAll(Sort.by("name").ascending()) } returns unitMeasurementList

        val result = unitMeasurementService.findAll()

        result shouldNotBe null
        result.size shouldBe 2
        result[0] shouldBe unitMeasurement1
        result[1] shouldBe unitMeasurement2
        verify(exactly = 1) { unitMeasurementRepository.findAll(Sort.by("name").ascending()) }
    }
})
