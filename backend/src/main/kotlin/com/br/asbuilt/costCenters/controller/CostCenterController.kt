package com.br.asbuilt.costCenters.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.costCenters.CostCenterService
import com.br.asbuilt.costCenters.controller.requests.CreateCostCenterRequest
import com.br.asbuilt.costCenters.controller.requests.PatchCostCenterRequest
import com.br.asbuilt.costCenters.controller.responses.CostCenterResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/costCenter")
class CostCenterController(val service: CostCenterService) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/insertCostCenter")
    fun insert(@Valid @RequestBody costCenter: CreateCostCenterRequest) =
        CostCenterResponse(service.insert(costCenter.toCostCenter()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateCostCenter")
    fun updateCostCenter(@Valid @RequestBody request: PatchCostCenterRequest) =
        CostCenterResponse(service.updateCostCenter(request.toCostCenter())!!)
            .let{ ResponseEntity.status(HttpStatus.OK).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
            .map { CostCenterResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getCostCenterByName/{costCenterName}")
    fun getByName(@PathVariable costCenterName: String) =
        service.findByName(costCenterName)
            ?.let { ResponseEntity.ok(CostCenterResponse(it)) }
            ?: ResponseEntity.notFound().build()

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getCostCenterByBuilder/{builderId}")
    fun getCostCenterByBuilder(@PathVariable builderId: Long) =
        service.findCostCentersByBuilderId(builderId)
            .map { CostCenterResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteCostCenter/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        if (service.delete(id)) ResponseEntity.ok().build()
        else ResponseEntity.notFound().build()

}