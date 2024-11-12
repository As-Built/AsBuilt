package com.br.asbuilt

import com.br.asbuilt.address.Address
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.builders.Builder
import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.costCenters.CostCenterRepository
import com.br.asbuilt.costCenters.CostCenterService
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.tasks.TaskRepository
import com.jayway.jsonpath.internal.path.PathCompiler.fail
import io.mockk.*
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.kotest.assertions.throwables.shouldThrow
import kotlinx.coroutines.runBlocking
import org.hibernate.validator.internal.util.Contracts.assertTrue
import java.util.*

class CostCenterServiceTest : StringSpec({

    val costCenterRepository = mockk<CostCenterRepository>()
    val addressRepository = mockk<AddressRepository>()
    val taskRepository = mockk<TaskRepository>()
    val costCenterService = CostCenterService(costCenterRepository, addressRepository, taskRepository)

    val address = mockk<Address>(relaxed = true)
    val builder = mockk<Builder>(relaxed = true)

    "should insert CostCenter successfully" {
        val costCenter = CostCenter(
            costCenterName = "CostCenter1",
            costCenterAddress = address,
            valueUndertaken = 100.0,
            expectedBudget = 200.0,
            builder = builder
        )

        every { costCenterRepository.findCostCenterByName(costCenter.costCenterName) } returns null
        every { addressRepository.findCostCenterByFullAddress(any(), any(), any(), any(), any()) } returns null
        every { addressRepository.save(costCenter.costCenterAddress) } returns costCenter.costCenterAddress
        every { costCenterRepository.save(costCenter) } returns costCenter

        val result = costCenterService.insert(costCenter)

        result shouldBe costCenter

        verify(exactly = 1) { costCenterRepository.findCostCenterByName(costCenter.costCenterName) }
        verify(exactly = 1) { addressRepository.findCostCenterByFullAddress(any(), any(), any(), any(), any()) }
        verify(exactly = 1) { costCenterRepository.save(costCenter) }
    }

    "should throw BadRequestException when CostCenter with the same name already exists" {
        val costCenter = CostCenter(
            costCenterName = "CostCenter1",
            costCenterAddress = address,
            valueUndertaken = 100.0,
            expectedBudget = 200.0,
            builder = builder
        )

        every { costCenterRepository.findCostCenterByName(costCenter.costCenterName) } returns costCenter

        shouldThrow<BadRequestException> {
            costCenterService.insert(costCenter)
        }

        verify(exactly = 2) { costCenterRepository.findCostCenterByName(costCenter.costCenterName) }
    }

    "should delete CostCenter successfully" {
        val costCenter = CostCenter(
            id = 1L,
            costCenterName = "CostCenter1",
            costCenterAddress = address,
            valueUndertaken = 100.0,
            expectedBudget = 200.0,
            builder = builder
        )

        every { costCenterRepository.findById(costCenter.id!!) } returns Optional.of(costCenter)
        every { taskRepository.findTasksByCostCenterId(costCenter.id!!) } returns emptyList()
        every { costCenterRepository.delete(costCenter) } just Runs
        every { addressRepository.delete(costCenter.costCenterAddress) } just Runs

        val result = costCenterService.delete(costCenter.id!!)

        result shouldBe true

        verify(exactly = 1) { costCenterRepository.delete(costCenter) }
        verify(exactly = 1) { addressRepository.delete(costCenter.costCenterAddress) }
    }

})
