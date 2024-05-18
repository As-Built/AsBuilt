package com.br.asbuilt.locations

import com.br.asbuilt.SortDir
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class LocationService(
    val repository: LocationRepository,
    val taskRepository: TaskRepository
) {
    fun insert(location: Location): Location {

        val existingLocation = repository.existsLocation(
            location.costCenter.id!!,
            location.locationGroup,
            location.subGroup1,
            location.subGroup2,
            location.subGroup3
        )

        if (existingLocation != null) {
            throw BadRequestException("Location already exists")
        }

        return repository.save(location)
            .also { log.info("Location inserted: {}", it.id) }
    }

    fun updateLocation(location: Location): Location? {
        val existingLocation = location.id!!.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("Location not found with id: ${location.id}") }
        }

        var isChanged = false

        if (existingLocation != null) {

            if (location.costCenter.id != existingLocation.costCenter.id) {
                existingLocation.costCenter = location.costCenter
                isChanged = true
            }

            if (location.locationGroup != existingLocation.locationGroup) {
                existingLocation.locationGroup = location.locationGroup
                isChanged = true
            }
            if (location.subGroup1 != existingLocation.subGroup1) {
                existingLocation.subGroup1 = location.subGroup1
                isChanged = true
            }
            if (location.subGroup2 != existingLocation.subGroup2) {
                existingLocation.subGroup2 = location.subGroup2
                isChanged = true
            }
            if (location.subGroup3 != existingLocation.subGroup3) {
                existingLocation.subGroup3 = location.subGroup3
                isChanged = true
            }
            if (isChanged) {
                return repository.save(existingLocation)
                    .also { log.info("Location updated: {}", it.id) }
            } else {
                throw BadRequestException("No changes detected! Location not updated!")
                    .also { log.info("Location not updated (nothing changed): {}", location.id) }
            }
        }
        else {
            throw BadRequestException("Location not found!")
            .also { log.info("Location not found with id: ${location.id}") }
        }
    }


    fun findAll(dir: SortDir = SortDir.ASC): List<Location> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("locationGroup", "subGroup1", "subGroup2", "subGroup3").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("locationGroup", "subGroup1", "subGroup2", "subGroup3").descending())
    }

    fun findLocationByGroup(locationGroup: String): List<Location> = repository.findLocationByGroup(locationGroup)

    fun findLocationBySubGroup1(subGroup1: String): List<Location> = repository.findLocationBySubGroup1(subGroup1)

    fun findLocationBySubGroup2(subGroup2: String): List<Location> = repository.findLocationBySubGroup2(subGroup2)

    fun findLocationBySubGroup3(subGroup3: String): List<Location> = repository.findLocationBySubGroup3(subGroup3)

    fun delete(id: Long): Boolean {
        if (repository.existsById(id)) {

            val tasksRelated = taskRepository.findTasksByLocationId(id)

            if (tasksRelated.isNotEmpty()) {
                throw BadRequestException("This Location has tasks related to it, please delete the tasks first!")
            }

            repository.deleteById(id)
                .also { log.info("Location deleted: {}", id) }

            return true

        } else {
            throw NotFoundException("Location not found with id: $id")
        }
    }


    companion object {
        private val log = LoggerFactory.getLogger(LocationService::class.java)
    }
}