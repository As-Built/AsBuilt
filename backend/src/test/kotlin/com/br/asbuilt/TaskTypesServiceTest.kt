package com.br.asbuilt

import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.taskTypes.TaskType
import com.br.asbuilt.taskTypes.TaskTypeRepository
import com.br.asbuilt.taskTypes.TaskTypeService
import com.br.asbuilt.tasks.TaskRepository
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.*
import org.springframework.data.domain.Sort
import java.util.*

class TaskTypeServiceTest : StringSpec({

    lateinit var taskTypeRepository: TaskTypeRepository
    lateinit var taskRepository: TaskRepository
    lateinit var taskTypeService: TaskTypeService

    beforeEach {
        taskTypeRepository = mockk()
        taskRepository = mockk()
        taskTypeService = TaskTypeService(taskTypeRepository, taskRepository)
    }

    "should throw BadRequestException when taskType already exists" {

        val taskType = TaskType(id = 1L, taskTypeName = "Task Type", taskTypeDescription = "Task Description", unitMeasurement = mockk(),
            parameter0Name = "Parametro", parameter1Name = "Parametro1", parameter2Name = "Parametro2", parameter3Name = "Parametro3",
            parameter4Name = null, parameter5Name = null, parameter6Name = null, parameter7Name = null,
            parameter8Name = null, parameter9Name = null, comments = null )

        every { taskTypeRepository.findTaskTypeByName(taskType.taskTypeName) } returns taskType

        shouldThrow<BadRequestException> {
            taskTypeService.insert(taskType)
        }

        verify(exactly = 1) { taskTypeRepository.findTaskTypeByName(taskType.taskTypeName) }
    }

    "should insert taskType successfully" {
        val taskType = TaskType(id = 1L, taskTypeName = "Task Type", taskTypeDescription = "Task Description", unitMeasurement = mockk(),
            parameter0Name = "Parametro", parameter1Name = "Parametro1", parameter2Name = "Parametro2", parameter3Name = "Parametro3",
            parameter4Name = null, parameter5Name = null, parameter6Name = null, parameter7Name = null,
            parameter8Name = null, parameter9Name = null, comments = null )

        every { taskTypeRepository.findTaskTypeByName(taskType.taskTypeName) } returns null
        every { taskTypeRepository.save(taskType) } returns taskType

        val result = taskTypeService.insert(taskType)

        result shouldBe taskType
        verify(exactly = 1) { taskTypeRepository.save(taskType) }
    }

    "should return list of taskTypes sorted by taskTypeName" {
        val taskType1 = TaskType(id = 1L, taskTypeName = "Task Type", taskTypeDescription = "Task Description", unitMeasurement = mockk(),
            parameter0Name = "Parametro", parameter1Name = "Parametro1", parameter2Name = "Parametro2", parameter3Name = "Parametro3",
            parameter4Name = null, parameter5Name = null, parameter6Name = null, parameter7Name = null,
            parameter8Name = null, parameter9Name = null, comments = null )
        val taskType2 = TaskType(id = 1L, taskTypeName = "Task Type", taskTypeDescription = "Task Description", unitMeasurement = mockk(),
            parameter0Name = "Parametro", parameter1Name = "Parametro1", parameter2Name = "Parametro2", parameter3Name = "Parametro3",
            parameter4Name = null, parameter5Name = null, parameter6Name = null, parameter7Name = null,
            parameter8Name = null, parameter9Name = null, comments = null )

        every { taskTypeRepository.findAll(Sort.by("taskTypeName").ascending()) } returns listOf(taskType1, taskType2)

        val result = taskTypeService.findAll(SortDir.ASC)

        result shouldBe listOf(taskType1, taskType2)
        verify(exactly = 1) { taskTypeRepository.findAll(Sort.by("taskTypeName").ascending()) }
    }

    "should delete taskType successfully when no related tasks" {
        val taskType = TaskType(id = 1L, taskTypeName = "Task Type", taskTypeDescription = "Task Description", unitMeasurement = mockk(),
            parameter0Name = "Parametro", parameter1Name = "Parametro1", parameter2Name = "Parametro2", parameter3Name = "Parametro3",
            parameter4Name = null, parameter5Name = null, parameter6Name = null, parameter7Name = null,
            parameter8Name = null, parameter9Name = null, comments = null )

        every { taskRepository.findTasksByTaskTypeId(taskType.id!!) } returns emptyList()
        every { taskTypeRepository.existsById(taskType.id!!) } returns true
        every { taskTypeRepository.deleteById(taskType.id!!) } just Runs

        val result = taskTypeService.delete(taskType.id!!)

        result shouldBe true
        verify(exactly = 1) { taskTypeRepository.deleteById(taskType.id!!) }
    }
})