package com.br.asbuilt.salary.controller

import com.br.asbuilt.salary.SalaryService
import com.br.asbuilt.salary.controller.requests.CreateSalaryRequest
import com.br.asbuilt.salary.controller.responses.SalaryResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/salary")
class SalaryController(
    val service: SalaryService
) {
    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/insertSalary")
    fun insert(@Valid @RequestBody salary: CreateSalaryRequest): ResponseEntity<SalaryResponse> {
        return service.insert(salary).let { it ->
            SalaryResponse(it).let { ResponseEntity.status(HttpStatus.CREATED).body(it) }
        }
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @GetMapping("/sumLatestSalaries")
    fun sumLatestSalaries(): ResponseEntity<Double> {
        return ResponseEntity.ok(service.sumLatestSalaries())
    }
}