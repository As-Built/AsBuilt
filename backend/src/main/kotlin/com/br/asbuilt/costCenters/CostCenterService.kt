package com.br.asbuilt.costCenters

import com.br.asbuilt.SortDir
import com.br.asbuilt.address.Address
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.ForbiddenException
import com.br.asbuilt.exception.NotFoundException
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class CostCenterService(
    val repository: CostCenterRepository,
    val addressRepository: AddressRepository
) {
    fun insert(costCenter: CostCenter): CostCenter {
        if (repository.findCostCenterByName(costCenter.costCenterName) != null) {
            throw BadRequestException("Cost Center already exists")
        }

        val existingAddress = addressRepository.findFullAddress(
            costCenter.costCenterAddress.street,
            costCenter.costCenterAddress.number,
            costCenter.costCenterAddress.city,
            costCenter.costCenterAddress.state,
            costCenter.costCenterAddress.postalCode
        )

        if (existingAddress != null) {
            throw BadRequestException("A Cost Center with the same address already exists!")
        }

        var savedAddress = addressRepository.save(costCenter.costCenterAddress)
            .also { log.info("Address inserted: {}", it.id)}
        costCenter.costCenterAddress = savedAddress

        return repository.save(costCenter)
            .also { log.info("Cost Center inserted: {}", it.id) }
    }

    fun findByIdOrNull(id: Long) = repository.findById(id).getOrNull()

    fun findByIdOrThrow(id: Long) =
        findByIdOrNull(id) ?: throw NotFoundException(id)

    fun updateName(id: Long, name: String): CostCenter? {
        val costCenter = findByIdOrThrow(id)

        if (costCenter.costCenterName == name) return null
        costCenter.costCenterName = name

        return repository.save(costCenter)
    }

    fun updateAddress(id: Long, address: Address): CostCenter? {
        val costCenter = findByIdOrThrow(id)

        if (costCenter.costCenterAddress == address) return null
        costCenter.costCenterAddress = address

        return repository.save(costCenter)
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
        SortDir.ASC -> repository.findAll(Sort.by("nomeCentroDeCusto").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("nomeCentroDeCusto").descending())
    }

    fun findByName(nomeCentroDeCusto: String): CostCenter? {
        return repository.findCostCenterByName(nomeCentroDeCusto) ?: throw NotFoundException("Cost Center not found: $nomeCentroDeCusto")
    }

    fun delete(id: Long): Boolean {
        val costCenter = findByIdOrNull(id) ?: return false

        if (costCenter.valueUndertaken > 0) throw ForbiddenException("Cannot delete a Cost Center with value undertaken!")

        repository.delete(costCenter)
        log.info("Cost Center deleted: {}", costCenter.id)
        return true
    }

    companion object {
        private val log = LoggerFactory.getLogger(CostCenterService::class.java)
    }
}