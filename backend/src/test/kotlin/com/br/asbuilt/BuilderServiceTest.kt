package com.br.asbuilt

import com.br.asbuilt.SortDir
import com.br.asbuilt.address.Address
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.builders.Builder
import com.br.asbuilt.builders.BuilderRepository
import com.br.asbuilt.builders.BuilderService
import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.costCenters.CostCenterRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.*
import org.springframework.data.domain.Sort
import java.util.*

class BuilderServiceTest : StringSpec({

    lateinit var builderRepository: BuilderRepository
    lateinit var addressRepository: AddressRepository
    lateinit var costCenterRepository: CostCenterRepository
    lateinit var builderService: BuilderService

    beforeEach {
        builderRepository = mockk()
        addressRepository = mockk()
        costCenterRepository = mockk()
        builderService = BuilderService(builderRepository, addressRepository, costCenterRepository)
    }

    "should throw BadRequestException when builder with the same name already exists" {
        val builder = Builder(
            id = 1L,
            builderName = "Builder1",
            cnpj = "12345678000100",
            builderAddress = mockk(),
            phone = "1234"
        )

        every { builderRepository.findBuilderByName(builder.builderName) } returns builder

        shouldThrow<BadRequestException> {
            builderService.insert(builder)
        }

        verify(exactly = 1) { builderRepository.findBuilderByName(builder.builderName) }
    }

    "should throw BadRequestException when trying to delete builder with related cost center" {
        val builder = Builder(
            id = 1L,
            builderName = "Builder1",
            cnpj = "12345678000100",
            builderAddress = mockk(),
            phone = "1234"
        )
        val costCenters = listOf(mockk<CostCenter>())

        every { builderRepository.findById(builder.id!!) } returns Optional.of(builder)

        every { costCenterRepository.findCostCentersByBuilderId(builder.id!!) } returns costCenters

        shouldThrow<BadRequestException> {
            builderService.delete(builder.id!!)
        }

        verify(exactly = 1) { builderRepository.findById(builder.id!!) }
        verify(exactly = 1) { costCenterRepository.findCostCentersByBuilderId(builder.id!!) }
    }

    "should insert builder" {
        val mockAddress = mockk<Address>()
        every { mockAddress.street } returns "Rua Teste"
        every { mockAddress.number } returns 123
        every { mockAddress.city } returns "São Paulo"
        every { mockAddress.state } returns "SP"
        every { mockAddress.postalCode } returns "12345-678"
        every { mockAddress.id } returns 1L

        val builder = Builder(
            builderName = "Builder1",
            cnpj = "12345678000100",
            builderAddress = mockAddress,
            phone = "1234"
        )

        every { builderRepository.findBuilderByName(builder.builderName) } returns null
        every { builderRepository.findByCnpj(builder.cnpj) } returns null
        every { addressRepository.findBuilderByFullAddress(any(), any(), any(), any(), any()) } returns null
        every { addressRepository.save(any()) } returns mockAddress
        every { builderRepository.save(builder) } returns builder

        val result = builderService.insert(builder)

        result shouldBe builder
        verify(exactly = 1) { builderRepository.save(builder) }
        verify(exactly = 1) { addressRepository.save(mockAddress) }
    }


    "should return all builders sorted by name ascending" {
        val builder1 =
            Builder(id = 1L, builderName = "Builder A", cnpj = "123", builderAddress = mockk(), phone = "123")
        val builder2 =
            Builder(id = 2L, builderName = "Builder B", cnpj = "456", builderAddress = mockk(), phone = "456")
        val builders = listOf(builder1, builder2)

        every { builderRepository.findAll(Sort.by("builderName").ascending()) } returns builders

        val result = builderService.findAll(SortDir.ASC)

        result shouldBe builders
        verify(exactly = 1) { builderRepository.findAll(Sort.by("builderName").ascending()) }
    }

    "should find builder by name successfully" {
        val builderName = "Builder1"
        val builder = Builder(
            id = 1L,
            builderName = builderName,
            cnpj = "12345678000100",
            builderAddress = mockk(),
            phone = "1234"
        )

        every { builderRepository.findBuilderByName(builderName) } returns builder

        val result = builderService.findByName(builderName)

        if (result != null) {
            result.builderName shouldBe builderName
        }
        verify(exactly = 1) { builderRepository.findBuilderByName(builderName) }
    }

    "should throw NotFoundException when builder is not found by name" {
        val builderName = "Builder1"

        every { builderRepository.findBuilderByName(builderName) } returns null

        shouldThrow<NotFoundException> {
            builderService.findByName(builderName)
        }

        verify(exactly = 1) { builderRepository.findBuilderByName(builderName) }
    }

    "should throw BadRequestException when trying to delete builder with related cost center" {
        val builder = Builder(
            id = 1L,
            builderName = "Builder1",
            cnpj = "12345678000100",
            builderAddress = mockk(),
            phone = "1234"
        )
        val costCenters = listOf(mockk<CostCenter>())

        every { builderRepository.findById(builder.id!!) } returns Optional.of(builder)

        every { costCenterRepository.findCostCentersByBuilderId(builder.id!!) } returns costCenters

        shouldThrow<BadRequestException> {
            builderService.delete(builder.id!!)
        }

        verify(exactly = 1) { builderRepository.findById(builder.id!!) }
        verify(exactly = 1) { costCenterRepository.findCostCentersByBuilderId(builder.id!!) }
    }


    "should delete builder successfully" {
        val mockAddress = mockk<Address>()
        every { mockAddress.id } returns 1L
        every { mockAddress.street } returns "Rua Teste"
        every { mockAddress.number } returns 123
        every { mockAddress.city } returns "São Paulo"
        every { mockAddress.state } returns "SP"
        every { mockAddress.postalCode } returns "12345-678"

        val builder = Builder(
            id = 1L,
            builderName = "Builder1",
            cnpj = "12345678000100",
            builderAddress = mockAddress,
            phone = "1234"
        )

        every { builderRepository.findById(builder.id!!) } returns Optional.of(builder)
        every { costCenterRepository.findCostCentersByBuilderId(builder.id!!) } returns emptyList()
        every { builderRepository.delete(builder) } just Runs
        every { addressRepository.delete(builder.builderAddress) } just Runs

        val result = builderService.delete(builder.id!!)

        result shouldBe true

        verify(exactly = 1) { builderRepository.delete(builder) }
        verify(exactly = 1) { addressRepository.delete(builder.builderAddress) }
    }

})