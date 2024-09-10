package com.br.asbuilt.builders

import com.br.asbuilt.SortDir
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.address.AddressRepositoryCustom
import com.br.asbuilt.costCenters.CostCenterRepository
import com.br.asbuilt.costCenters.CostCenterService
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class BuilderService(
    val repository: BuilderRepository,
    val addressRepository: AddressRepository,
    val costCenterRepository: CostCenterRepository,
    val addressRepositoryCustom: AddressRepositoryCustom

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

        val savedAddress = addressRepository.save(builder.builderAddress)
            .also { log.info("Address inserted: {}", it.id)}
        builder.builderAddress = savedAddress

        return repository.save(builder)
            .also { log.info("Builder inserted: {}", it.id) }
    }

    fun findAll(dir: SortDir = SortDir.ASC): List<Builder> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("builderName").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("builderName").descending())
    }

    fun findByName(builderName: String): Builder? {
        return repository.findBuilderByName(builderName) ?: throw NotFoundException("Builder not found: $builderName")
    }

    fun updateBuilder(builder: Builder): Builder? {
        val existingBuilder = builder.id!!.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("Builder not found with id: ${builder.id}") }
        }

        if (existingBuilder != null) {
            var isChanged = false

            if (builder.builderAddress != existingBuilder.builderAddress) {
                try{
                    addressRepositoryCustom.validateAndUpdateEntityAddress(
                        street = builder.builderAddress.street,
                        number = builder.builderAddress.number,
                        city = builder.builderAddress.city,
                        state = builder.builderAddress.state,
                        postalCode = builder.builderAddress.postalCode,
                        entityId = existingBuilder.id,
                        entityTable = "builder_address",
                        entityAddressColumn = "id_address",
                        entityIdColumn = "id_builder"
                    )
                    isChanged = true
                }catch(ex: Exception){
                    println(ex.message)
                    throw BadRequestException("A Builder with the same address already exists!")
                }

            }
            if (builder.builderName != existingBuilder.builderName) {
                existingBuilder.builderName = builder.builderName
                isChanged = true
            }

            if (builder.cnpj != existingBuilder.cnpj) {
                existingBuilder.cnpj = builder.cnpj
                isChanged = true
            }

            if (builder.builderAddress != existingBuilder.builderAddress) {
                existingBuilder.builderAddress = builder.builderAddress
                isChanged = true
            }

            if (builder.phone != existingBuilder.phone) {
                existingBuilder.phone = builder.phone
                isChanged = true
            }

            if (isChanged) {

                val newAddress = builder.builderAddress
                newAddress.id = builder.builderAddress.id

                val savedAddress = addressRepository.save(newAddress)
                    .also { log.info("Address updated: {}", it.id)}
                builder.builderAddress = savedAddress

                val updateBuilder = repository.save(existingBuilder)
                log.info("Builder updated: {}", updateBuilder.id)
                return updateBuilder
            }
        }
        return null
    }

    fun delete(id: Long): Boolean {
        val builder = id.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("Builder not found with id: $id") }
        }

        val costCenterRelated = costCenterRepository.findCostCentersByBuilderId(id)

        if (costCenterRelated.isNotEmpty()) {
            throw BadRequestException("This Builder has a Cost Center related to it, please delete the Cost Center first!")
        }

        repository.delete(builder)
        log.info("Builder deleted: {}", builder.id)

        addressRepository.delete(builder.builderAddress)
        log.info("Address deleted: {}", builder.builderAddress.id)
        return true
    }

    companion object {
        private val log = LoggerFactory.getLogger(CostCenterService::class.java)
    }
}