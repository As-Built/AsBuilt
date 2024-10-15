package com.br.asbuilt.tasks

import com.br.asbuilt.SortDir
import com.br.asbuilt.costCenters.CostCenterRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.locations.Location
import com.br.asbuilt.locations.LocationRepository
import com.br.asbuilt.taskTypes.TaskTypeRepository
import com.br.asbuilt.unitMeasurement.UnitMeasurementRepository
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.text.SimpleDateFormat

@Service
class TaskService (
    val repository: TaskRepository,
    val costCenterRepository: CostCenterRepository,
    val locationRepository: LocationRepository,
    val taskTypeRepository: TaskTypeRepository,
    val unitMeasurementRepository: UnitMeasurementRepository
) {

    fun insert(task: Task): Task {
        val existingTask = repository.existsTask(
            task.costCenter.id!!,
            task.taskType.id!!,
            task.taskLocation.locationGroup,
            task.taskLocation.subGroup1,
            task.taskLocation.subGroup2,
            task.taskLocation.subGroup3
        )

        if (existingTask != null) {
            throw BadRequestException("Task already exists")
        }

        val centroDeCustoId = task.costCenter.id

        val centroDeCusto = centroDeCustoId?.let {
            costCenterRepository.findById(it)
                .orElseThrow { NotFoundException("Cost center not found with ID: $centroDeCustoId") }
        }

        if (centroDeCusto == null) {
            throw NotFoundException("Cost center not found!")
        }

        task.costCenter = centroDeCusto

        if (task.taskLocation.subGroup1 == "") {
            task.taskLocation.subGroup1 = null
        }

        if (task.taskLocation.subGroup2 == "") {
            task.taskLocation.subGroup2 = null
        }

        if (task.taskLocation.subGroup3 == "") {
            task.taskLocation.subGroup3 = null
        }

        val locationId = locationRepository.findLocationId(
            task.costCenter.id!!,
            task.taskLocation.locationGroup,
            task.taskLocation.subGroup1,
            task.taskLocation.subGroup2,
            task.taskLocation.subGroup3
        )

        val location = locationId?.let {
            locationRepository.findById(it)
                .orElseThrow { NotFoundException("Location not found with ID: $locationId") }
        }

        if (location == null) {
            throw NotFoundException("Location not found!")
        }

        task.taskLocation = location

        return repository.save(task)
            .also{ log.info("Task inserted: {}", it.id) }
    }

    fun updateTask(request: Task): Task? {
        val existingTask = request.id!!.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("Task not found!") }
                .also { log.info("Task not found with id: ${request.id}") }
        }

        if (existingTask != request) {
                return repository.save(request)
                    .also { log.info("Task updated: {}", it.id) }
        } else {
            throw BadRequestException("No changes detected! Task not updated!")
                .also { log.info("Task not updated (nothing changed): {}", request.id) }
        }
    }

    fun findAll(dir: SortDir = SortDir.ASC): List<Task> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("expectedStartDate").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("expectedStartDate").descending())
    }

    fun delete(idTask: Long): Boolean {
        val task = repository.findByIdOrNull(idTask) ?: return false
        // TODO: Implementar condição que verifica se existem avaliações relacionadas ao serviço
        repository.delete(task)
        log.info("Task deleted: {}", task.id)
        return true
    }

    fun findByUserName(userName: String, sortDir: String?): List<Task> {
        val sort = if (sortDir == "DESC") Sort.by(Sort.Order.desc("id")) else Sort.by(Sort.Order.asc("id"))
        return repository.findByUserName(userName, sort)
    }

    fun findByIdOrNull(id: Long): Task? = repository.findByIdOrNull(id)

    fun insertBatchTasks(file: MultipartFile): Int {
        val workbook = WorkbookFactory.create(file.inputStream)
        val sheet = workbook.getSheetAt(0)
        var taskCount = 0

        for (row in sheet.drop(1)) { // Pula a linha de cabeçalho
            val builderNameCell = row.getCell(0)
            if (builderNameCell == null || builderNameCell.stringCellValue.isBlank()) {
                break // Encerra o loop se a célula referente a coluna de construtora estiver vazia
            }
            val costCenterCell = row.getCell(1)
            if  (costCenterCell == null || costCenterCell.stringCellValue.isBlank()) {
                break // Encerra o loop se a célula referente a coluna de centro de custo estiver vazia
            }

            val locationGroupCell = row.getCell(2)
            if (locationGroupCell == null || locationGroupCell.stringCellValue.isBlank()) {
                break // Encerra o loop se a célula referente a coluna de grupo de localização estiver vazia
            }

            val taskTypeNameCell = row.getCell(6)
            if (taskTypeNameCell == null || taskTypeNameCell.stringCellValue.isBlank()) {
                break // Encerra o loop se a célula referente a coluna de tipo de tarefa estiver vazia
            }

            val dimensionCell = row.getCell(7)
            if (dimensionCell == null || dimensionCell.numericCellValue == 0.0) {
                break // Encerra o loop se a célula referente a coluna de dimensão estiver vazia
            }

            val unitMeasurementNameCell = row.getCell(8)
            if (unitMeasurementNameCell == null || unitMeasurementNameCell.stringCellValue.isBlank()) {
                break // Encerra o loop se a célula referente a coluna de unidade de medida estiver vazia
            }

            val unitaryValueCell = row.getCell(9)
            if (unitaryValueCell == null || unitaryValueCell.numericCellValue == 0.0) {
                break // Encerra o loop se a célula referente a coluna de valor unitário estiver vazia
            }

            val expectedStartDateCell = row.getCell(11)
                ?: break // Encerra o loop se a célula referente a coluna de data de início prevista estiver vazia

            val expectedEndDateCell = row.getCell(12)
                ?: break // Encerra o loop se a célula referente a coluna de data de término prevista estiver vazia

            val builderName = builderNameCell.stringCellValue
            val costCenterName = costCenterCell.stringCellValue
            val locationGroup = locationGroupCell.stringCellValue
            val subGroup1 = row.getCell(3)?.stringCellValue
            val subGroup2 = row.getCell(4)?.stringCellValue
            val subGroup3 = row.getCell(5)?.stringCellValue
            val taskTypeName = taskTypeNameCell.stringCellValue
            val dimension = dimensionCell.numericCellValue
            val unitMeasurementName = unitMeasurementNameCell.stringCellValue
            val unitaryValue = unitaryValueCell.numericCellValue
            val amount = dimensionCell.numericCellValue * unitaryValueCell.numericCellValue
            val expectedStartDate = expectedStartDateCell.dateCellValue
            val expectedEndDate = expectedEndDateCell.dateCellValue

            val costCenter = costCenterRepository.findByCostCenterNameAndBuilder(costCenterName, builderName)
                ?: throw NotFoundException("Cost center not found for name: $costCenterName and builder: $builderName")

            var location = locationRepository.findLocationByCostCenterNameAndLocation(locationGroup, subGroup1, subGroup2, subGroup3, costCenterName)

            if (location == null) {
                location = Location(
                    costCenter = costCenter,
                    locationGroup = locationGroup,
                    subGroup1 = subGroup1,
                    subGroup2 = subGroup2,
                    subGroup3 = subGroup3
                )
                location = locationRepository.save(location)
                    .also { log.info("Location inserted by file: {}", it.id) }
            }

            val taskType = taskTypeRepository.findTaskTypeByName(taskTypeName)
                ?: throw NotFoundException("Task type not found for name: $taskTypeName")

            val unitMeasurement = unitMeasurementRepository.findByName(unitMeasurementName)
                ?: throw NotFoundException("Unit measurement not found for name: $unitMeasurementName")

            val task = Task(
                taskType = taskType,
                unitaryValue = unitaryValue,
                dimension = dimension,
                unitMeasurement = unitMeasurement,
                costCenter = costCenter,
                taskLocation = location,
                expectedStartDate = expectedStartDate,
                expectedEndDate = expectedEndDate,
                amount = amount,
                startDate = null,
                finalDate = null,
                obs = null
            )

            repository.save(task)
                .also { log.info("Task inserted by file: {}", it.id) }
            taskCount++
        }
        return taskCount
            .also { log.info("Batch insert completed. Inserted {} tasks", it) }
    }

    companion object {
        private val log = LoggerFactory.getLogger(TaskService::class.java)
    }
}