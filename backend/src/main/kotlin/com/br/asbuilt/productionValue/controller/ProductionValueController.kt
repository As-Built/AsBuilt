package com.br.asbuilt.productionValue.controller

import com.br.asbuilt.productionValue.ProductionValueService
import com.br.asbuilt.productionValue.controller.requests.CreateProductionValueRequest
import com.br.asbuilt.productionValue.controller.responses.ProductionValueResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/productionValue")
class ProductionValueController(
    val service: ProductionValueService
) {
    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertProductionValue")
    fun insert( @Valid @RequestBody productionValue: CreateProductionValueRequest) =
        ProductionValueResponse(service.insert(productionValue.toProductionValue()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getProductionValueByAssessmentId/{assessmentId}")
    fun getProductionValueByAssessmentId(@PathVariable assessmentId: Long) =
        service.getProductionValueByAssessmentId(assessmentId)
            .map { ProductionValueResponse(it) }
            .let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getProductionValueByMonthAndUserId/{month}/{userId}")
    fun getProductionValueByMonth(@PathVariable month: Int, @PathVariable userId: Long) =
        service.getProductionValueByMonthAndUserId(month, userId)
            .map { ProductionValueResponse(it) }
            .let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getProductionValueByUserId/{userId}")
    fun getProductionValueByUserId(@PathVariable userId: Long) =
        service.getProductionValueByUserId(userId)
            .map { ProductionValueResponse(it) }
            .let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getProductionValue")
    fun getProductionValue() =
        service.getProductionValue()
            .map { ProductionValueResponse(it) }
            .let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getProductionValueByMonth/{month}")
    fun getProductionValue(@PathVariable month: Int) =
        service.getProductionValueByMonth(month)
            .map { ProductionValueResponse(it) }
            .let { ResponseEntity.ok(it) }
}