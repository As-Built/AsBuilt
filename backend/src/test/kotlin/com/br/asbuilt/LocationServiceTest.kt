package com.br.asbuilt

import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.locations.Location
import com.br.asbuilt.locations.LocationRepository
import com.br.asbuilt.locations.LocationService
import com.br.asbuilt.tasks.TaskRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.*
import org.springframework.data.domain.Sort
import java.util.*

class LocationServiceTest : StringSpec({

    lateinit var locationRepository: LocationRepository
    lateinit var taskRepository: TaskRepository
    lateinit var locationService: LocationService

    beforeEach {
        locationRepository = mockk()
        taskRepository = mockk()
        locationService = LocationService(locationRepository, taskRepository)
    }

    "should delete location successfully" {
        val locationId = 1L

        every { locationRepository.existsById(locationId) } returns true
        every { taskRepository.findTasksByLocationId(locationId) } returns emptyList()
        every { locationRepository.deleteById(locationId) } just Runs

        val result = locationService.delete(locationId)

        result shouldBe true
        verify(exactly = 1) { locationRepository.existsById(locationId) }
        verify(exactly = 1) { taskRepository.findTasksByLocationId(locationId) }
        verify(exactly = 1) { locationRepository.deleteById(locationId) }
    }

    "should return location by locationGroup" {
        val locationGroup = "Group1"
        val location = Location(id = 1L, locationGroup = locationGroup, subGroup1 = "SubGroup1", subGroup2 = "SubGroup2", subGroup3 = "SubGroup3", costCenter = mockk())
        val locations = listOf(location)

        every { locationRepository.findLocationByGroup(locationGroup) } returns locations

        val result = locationService.findLocationByGroup(locationGroup)

        result shouldBe locations
        verify(exactly = 1) { locationRepository.findLocationByGroup(locationGroup) }
    }
})