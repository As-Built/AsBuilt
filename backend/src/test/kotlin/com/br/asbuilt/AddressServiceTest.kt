package com.br.asbuilt

import com.br.asbuilt.address.Address
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.address.AddressService
import com.br.asbuilt.exception.NotFoundException
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.assertions.throwables.shouldThrow
import io.mockk.*
import org.springframework.data.domain.Sort
import java.util.*

class AddressServiceTest : StringSpec({

    lateinit var addressRepository: AddressRepository
    lateinit var addressService: AddressService

    beforeEach {
        addressRepository = mockk()
        addressService = AddressService(addressRepository)
    }

    "should insert address" {
        val address = Address(
            street = "Rua A",
            number = 123,
            city = "Cidade X",
            state = "Estado Y",
            postalCode = "12345-678"
        )

        every { addressRepository.save(address) } returns address

        val savedAddress = addressService.insert(address)

        savedAddress shouldNotBe null
        savedAddress shouldBe address
        verify(exactly = 1) { addressRepository.save(address) }
    }

    "should find address by id or null" {
        val address = Address(
            street = "Rua A",
            number = 123,
            city = "Cidade X",
            state = "Estado Y",
            postalCode = "12345-678"
        )
        val addressId = 1L

        every { addressRepository.findById(addressId) } returns Optional.of(address)

        val foundAddress = addressService.findByIdOrNull(addressId)

        foundAddress shouldNotBe null
        foundAddress shouldBe address
        verify(exactly = 1) { addressRepository.findById(addressId) }
    }

    "should throw NotFoundException when address not found" {
        val addressId = 999L

        every { addressRepository.findById(addressId) } returns Optional.empty()

        shouldThrow<NotFoundException> {
            addressService.findByIdOrThrow(addressId)
        }

        verify(exactly = 1) { addressRepository.findById(addressId) }
    }

    "should update address" {
        val address = Address(
            street = "Rua A",
            number = 123,
            city = "Cidade X",
            state = "Estado Y",
            postalCode = "12345-678"
        )
        val addressId = 1L

        every { addressRepository.findById(addressId) } returns Optional.of(address)
        every { addressRepository.save(address) } returns address

        val updatedAddress = addressService.update(addressId)

        updatedAddress shouldNotBe null
        updatedAddress shouldBe address
        verify(exactly = 1) { addressRepository.findById(addressId) }
        verify(exactly = 1) { addressRepository.save(address) }
    }

    "should find all addresses in ascending order" {
        val address1 = Address(
            street = "Rua A",
            number = 123,
            city = "Cidade X",
            state = "Estado Y",
            postalCode = "12345-678"
        )
        val address2 = Address(
            street = "Rua B",
            number = 456,
            city = "Cidade Y",
            state = "Estado Z",
            postalCode = "98765-432"
        )

        val addressList = listOf(address1, address2)

        every { addressRepository.findAll(Sort.by("id").ascending()) } returns addressList

        val result = addressService.findAll(SortDir.ASC)

        result shouldNotBe null
        result.size shouldBe 2
        verify(exactly = 1) { addressRepository.findAll(Sort.by("id").ascending()) }
    }
})
