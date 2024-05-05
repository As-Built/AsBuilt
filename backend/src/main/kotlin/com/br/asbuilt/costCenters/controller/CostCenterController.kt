package com.br.asbuilt.costCenters.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.costCenters.CostCenterService
import com.br.asbuilt.costCenters.controller.requests.CreateCostCenterRequest
import com.br.asbuilt.costCenters.controller.requests.PatchCostCenterAddressRequest
import com.br.asbuilt.costCenters.controller.requests.PatchCostCenterNameResquest
import com.br.asbuilt.costCenters.controller.requests.PatchCostCenterValueRequest
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
    @PatchMapping("/updateCenterCostName/{id}")
    fun updateName(
        @Valid
        @RequestBody request: PatchCostCenterNameResquest,
        @PathVariable id: Long,
    ): ResponseEntity <CostCenterResponse> {
        return service.updateName(id, request.costCenterName)
            ?.let{ ResponseEntity.ok(CostCenterResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateCenterCostAddress/{id}")
    fun updateAddress(
        @Valid
        @RequestBody request: PatchCostCenterAddressRequest,
        @PathVariable id: Long,
    ): ResponseEntity <CostCenterResponse> {
        return service.updateAddress(id, request.costCenterAddress)
            ?.let{ ResponseEntity.ok(CostCenterResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateCenterCostValue/{id}")
    fun updateAddress(
        @Valid
        @RequestBody request: PatchCostCenterValueRequest,
        @PathVariable id: Long,
    ): ResponseEntity <CostCenterResponse> {
        return service.increaseValueUndertaken(id, request.valueUndertaken)
            ?.let{ ResponseEntity.ok(CostCenterResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
            .map { CostCenterResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getCostCenterByName/{nomeCentroDeCusto}")
    fun getByName(@PathVariable nomeCentroDeCusto: String) =
        service.findByName(nomeCentroDeCusto)
            ?.let { ResponseEntity.ok(CostCenterResponse(it)) }
            ?: ResponseEntity.notFound().build()

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        if (service.delete(id)) ResponseEntity.ok().build()
        else ResponseEntity.notFound().build()

}