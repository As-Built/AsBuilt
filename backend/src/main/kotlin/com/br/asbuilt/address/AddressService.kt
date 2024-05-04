package com.br.asbuilt.address

import com.br.asbuilt.SortDir
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.users.User
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class AddressService(
    val repository: AddressRepository
) {
    fun insert(address: Address): Address {
        return repository.save(address)
    }

    fun findByIdOrNull(id: Long) = repository.findById(id).getOrNull()

    fun findByIdOrThrow(id: Long) =
        findByIdOrNull(id) ?: throw NotFoundException(id)

    fun update(id: Long): Address {
        val address = findByIdOrThrow(id)
        return repository.save(address)
    }

    fun findAll(dir: SortDir = SortDir.ASC): List<Address> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("id").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("id").descending())
    }
}