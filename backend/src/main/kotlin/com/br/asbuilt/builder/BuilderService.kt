package com.br.asbuilt.builder

import com.br.asbuilt.SortDir
import com.br.asbuilt.address.Address
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.costCenters.CostCenterService
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class BuilderService(
    val repository: BuilderRepository,
    val addressRepository: AddressRepository
) {
    fun insert(builder: Builder): Builder {
        if (repository.findBuilderByName(builder.builderName) != null) {
            throw BadRequestException("A Builder with the same name already exists")
        }

        if (repository.findByCnpj(builder.cnpj) != null) {
            throw BadRequestException("A Builder with the same CNPJ already exists")
        }

        val existingAddress = addressRepository.findBuilderByFullAddress(
            builder.builderAddress.street,
            builder.builderAddress.number,
            builder.builderAddress.city,
            builder.builderAddress.state,
            builder.builderAddress.postalCode
        )

        if (existingAddress != null) {
            throw BadRequestException("A Builder with the same address already exists!")
        }

        var savedAddress = addressRepository.save(builder.builderAddress)
            .also { log.info("Address inserted: {}", it.id)}
        builder.builderAddress = savedAddress

        return repository.save(builder)
            .also { log.info("Builder inserted: {}", it.id) }
    }

    fun findByIdOrNull(id: Long) = repository.findById(id).getOrNull()

    fun findByIdOrThrow(id: Long) =
        findByIdOrNull(id) ?: throw NotFoundException(id)

    fun findAll(dir: SortDir = SortDir.ASC): List<Builder> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("builderName").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("builderName").descending())
    }

    fun findByName(builderName: String): Builder? {
        return repository.findBuilderByName(builderName) ?: throw NotFoundException("Builder not found: $builderName")
    }


    fun updateName(id: Long, name: String): Builder? {
        val builder = findByIdOrThrow(id)

        if (builder.builderName == name) return null
        builder.builderName = name

        return repository.save(builder)
    }

    fun updateAddress(id: Long, address: Address): Builder? {
        val builder = findByIdOrThrow(id)

        if (builder.builderAddress == address) return null
        builder.builderAddress = address

        return repository.save(builder)
    }

    fun updatePhone(id: Long, phone: String): Builder? {
        val builder = findByIdOrThrow(id)

        if (builder.phone == phone) return null
        builder.phone = phone

        return repository.save(builder)
    }

    fun delete(id: Long): Boolean {
        val builder = findByIdOrNull(id) ?: return false

        repository.delete(builder)
        BuilderService.log.info("Builder deleted: {}", builder.id)
        return true
    }

    companion object {
        private val log = LoggerFactory.getLogger(CostCenterService::class.java)
    }
}