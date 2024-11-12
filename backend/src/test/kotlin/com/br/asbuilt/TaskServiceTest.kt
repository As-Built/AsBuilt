package com.br.asbuilt

import com.br.asbuilt.address.Address
import com.br.asbuilt.assessment.AssessmentRepository
import com.br.asbuilt.builders.Builder
import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.costCenters.CostCenterRepository
import com.br.asbuilt.locations.Location
import com.br.asbuilt.locations.LocationRepository
import com.br.asbuilt.taskTypes.TaskType
import com.br.asbuilt.taskTypes.TaskTypeRepository
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import com.br.asbuilt.unitMeasurement.UnitMeasurementRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.tasks.TaskRepository
import com.br.asbuilt.tasks.TaskService
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.*
import org.springframework.data.repository.findByIdOrNull
import java.time.LocalDate
import java.util.*

class TaskServiceTest : StringSpec({

    lateinit var taskRepository: TaskRepository
    lateinit var costCenterRepository: CostCenterRepository
    lateinit var locationRepository: LocationRepository
    lateinit var taskTypeRepository: TaskTypeRepository
    lateinit var unitMeasurementRepository: UnitMeasurementRepository
    lateinit var assessmentRepository: AssessmentRepository
    lateinit var taskService: TaskService

    beforeEach {
        taskRepository = mockk()
        costCenterRepository = mockk()
        locationRepository = mockk()
        taskTypeRepository = mockk()
        unitMeasurementRepository = mockk()
        assessmentRepository = mockk()
        taskService = TaskService(
            taskRepository,
            costCenterRepository,
            locationRepository,
            taskTypeRepository,
            unitMeasurementRepository,
            assessmentRepository
        )
    }

    "should throw BadRequestException when task already exists" {
        val builder = Builder(
            id = 1L,
            builderName = "Builder A",
            cnpj = "12.345.678/0001-99",
            phone = "123456789",
            builderAddress = Address(id = 1L, street = "123 Main St", city = "City")
        )

        val costCenter = CostCenter(
            id = 1L,
            costCenterName = "Cost Center 1",
            costCenterAddress = Address(id = 1L, street = "123 Main St", city = "City"),
            valueUndertaken = 1000.0,
            expectedBudget = 5000.0,
            builder = builder
        )

        val unitMeasurement = UnitMeasurement(id = 1L, description = "Description",name = "Unit")

        val task = Task(
            taskType = TaskType(id = 1L, taskTypeName = "Task Type", taskTypeDescription = "Task Description", unitMeasurement = unitMeasurement,
                parameter0Name = "Parametro", parameter1Name = "Parametro1", parameter2Name = "Parametro2", parameter3Name = "Parametro3",
                parameter4Name = null, parameter5Name = null, parameter6Name = null, parameter7Name = null,
                parameter8Name = null, parameter9Name = null, comments = null ),
            unitaryValue = 10.0,
            dimension = 100.0,
            unitMeasurement = UnitMeasurement(id = 1L, description = "Description",name = "Unit"),
            costCenter = costCenter,
            taskLocation =  Location(id = 1L, locationGroup = "Group",costCenter = costCenter, subGroup1 = "SubGroup1", subGroup2 = "SubGroup2", subGroup3 = "SubGroup3"),
            expectedStartDate = Date(),
            startDate = null,
            expectedEndDate = Date(),
            finalDate = null,
            amount = 1000.0,
            obs = "No observations",
            executors = mutableSetOf(),
            evaluators = mutableSetOf()
        )

        every { taskRepository.existsTask(any(), any(), any(), any(), any(), any()) } returns mockk()

        shouldThrow<BadRequestException> {
            taskService.insert(task)
        }

        verify(exactly = 1) { taskRepository.existsTask(any(), any(), any(), any(), any(), any()) }
    }

    "should delete task" {
        val unitMeasurement = UnitMeasurement(id = 1L, description = "Description",name = "Unit")

        val builder = Builder(
            id = 1L,
            builderName = "Builder A",
            cnpj = "12.345.678/0001-99",
            phone = "123456789",
            builderAddress = Address(id = 1L, street = "123 Main St", city = "City")
        )

        val costCenter = CostCenter(
            id = 1L,
            costCenterName = "Cost Center 1",
            costCenterAddress = Address(id = 1L, street = "123 Main St", city = "City"),
            valueUndertaken = 1000.0,
            expectedBudget = 5000.0,
            builder = builder
        )

        val task = Task(id = 1L, costCenter = costCenter,
            taskType = TaskType(id = 1L, taskTypeName = "Task Type", taskTypeDescription = "Task Description", unitMeasurement = unitMeasurement,
                parameter0Name = "Parametro", parameter1Name = "Parametro1", parameter2Name = "Parametro2", parameter3Name = "Parametro3",
                parameter4Name = null, parameter5Name = null, parameter6Name = null, parameter7Name = null,
                parameter8Name = null, parameter9Name = null, comments = null ),
            unitaryValue = 10.0,
            dimension = 100.0,
            unitMeasurement = UnitMeasurement(id = 1L, description = "Description", name = "Unit"),
            taskLocation = Location(id = 1L, locationGroup = "Group",costCenter = costCenter, subGroup1 = "SubGroup1", subGroup2 = "SubGroup2", subGroup3 = "SubGroup3"),
            expectedStartDate = Date(),
            startDate = null,
            expectedEndDate = Date(),
            finalDate = null,
            amount = 1000.0,
            obs = "No observations",
            executors = mutableSetOf(),
            evaluators = mutableSetOf()
        )

        every { taskRepository.findByIdOrNull(1L) } returns task
        every { assessmentRepository.findAssessmentsByTaskId(1L) } returns emptyList()
        every { taskRepository.delete(task) } just Runs

        val result = taskService.delete(1L)

        result shouldBe true
        verify(exactly = 1) { taskRepository.delete(task) }
    }
})
