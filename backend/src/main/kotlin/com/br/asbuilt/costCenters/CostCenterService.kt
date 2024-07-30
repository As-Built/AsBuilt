package com.br.asbuilt.costCenters

import com.br.asbuilt.SortDir
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class CostCenterService(
    val repository: CostCenterRepository,
    val addressRepository: AddressRepository,
    val taskRepository: TaskRepository
) {
    fun insert(costCenter: CostCenter): CostCenter {
        if (repository.findCostCenterByName(costCenter.costCenterName) != null) {
            throw BadRequestException("Cost Center already exists")
        }

        val existingAddress = addressRepository.findCostCenterByFullAddress(
            costCenter.costCenterAddress.street,
            costCenter.costCenterAddress.number,
            costCenter.costCenterAddress.city,
            costCenter.costCenterAddress.state,
            costCenter.costCenterAddress.postalCode
        )

        if (existingAddress != null) {
            throw BadRequestException("A Cost Center with the same address already exists!")
        }

        val savedAddress = addressRepository.save(costCenter.costCenterAddress)
            .also { log.info("Address inserted: {}", it.id)}
        costCenter.costCenterAddress = savedAddress

        return repository.save(costCenter)
            .also { log.info("Cost Center inserted: {}", it.id) }
    }

    fun findByIdOrNull(id: Long) = repository.findById(id).getOrNull()

    fun findByIdOrThrow(id: Long) =
        findByIdOrNull(id) ?: throw NotFoundException(id)

    fun updateCostCenter(costCenter: CostCenter): CostCenter? {
        val existingCostCenter = costCenter.id!!.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("Cost Center not found with id: ${costCenter.id}") }
        }

        if (existingCostCenter != null) {
            var isChanged = false

            if (costCenter.costCenterName != existingCostCenter.costCenterName) {
                existingCostCenter.costCenterName = costCenter.costCenterName
                isChanged = true
            }

            if (costCenter.costCenterAddress != existingCostCenter.costCenterAddress) {
                existingCostCenter.costCenterAddress = costCenter.costCenterAddress
                isChanged = true
            }

            if (costCenter.valueUndertaken != existingCostCenter.valueUndertaken) {
                existingCostCenter.valueUndertaken = costCenter.valueUndertaken
                isChanged = true
            }

            if (costCenter.expectedBudget != existingCostCenter.expectedBudget) {
                existingCostCenter.expectedBudget = costCenter.expectedBudget
                isChanged = true
            }

            if (isChanged) {

                val existingAddress = addressRepository.findCostCenterByFullAddress(
                    costCenter.costCenterAddress.street,
                    costCenter.costCenterAddress.number,
                    costCenter.costCenterAddress.city,
                    costCenter.costCenterAddress.state,
                    costCenter.costCenterAddress.postalCode
                )

                if (existingAddress != null && existingAddress.id != costCenter.id) {
                    throw BadRequestException("A Cost Center with the same address already exists!")
                }

                val newAddress = costCenter.costCenterAddress
                newAddress.id = costCenter.costCenterAddress.id

                val savedAddress = addressRepository.save(newAddress)
                    .also { log.info("Address updated: {}", it.id)}
                costCenter.costCenterAddress = savedAddress

                val updateCostCenter = repository.save(existingCostCenter)
                log.info("Cost Center updated: {}", updateCostCenter.id)
                return updateCostCenter
            }
        }
        return null
    }

    fun increaseValueUndertaken(id: Long, value: Double): CostCenter? {
        val costCenter = findByIdOrThrow(id)

        if (value <= 0) return null
        costCenter.valueUndertaken += value

        return repository.save(costCenter)
    }

    fun decreaseValueUndertaken(id: Long, value: Double): CostCenter? {
        val costCenter = findByIdOrThrow(id)

        if (value <= 0) return null
        costCenter.valueUndertaken -= value

        return repository.save(costCenter)
    }

    fun findAll(dir: SortDir = SortDir.ASC): List<CostCenter> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("costCenterName").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("costCenterName").descending())
    }

    fun findByName(costCenterName: String): CostCenter? {
        return repository.findCostCenterByName(costCenterName) ?: throw NotFoundException("Cost Center not found: $costCenterName")
    }

    fun findCostCentersByBuilderId(builderId: Long): List<CostCenter> {
        return repository.findCostCentersByBuilderId(builderId)
    }

    fun delete(id: Long): Boolean {
        val costCenter = id.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("Cost Center not found with id: $id") }
        }

        val serviceRelated = taskRepository.findTasksByCostCenterId(id)

        if (serviceRelated.isNotEmpty()) {
            throw BadRequestException("This Cost Center has tasks related to it, please delete the tasks first!")
        }

        repository.delete(costCenter)
        log.info("Builder deleted: {}", costCenter.id)

        addressRepository.delete(costCenter.costCenterAddress)
        log.info("Address deleted: {}", costCenter.costCenterAddress.id)
        return true
    }

    companion object {
        private val log = LoggerFactory.getLogger(CostCenterService::class.java)
    }
}