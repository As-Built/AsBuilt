package com.br.asbuilt.builder.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.builder.BuilderService
import com.br.asbuilt.builder.controller.requests.CreateBuilderRequest
import com.br.asbuilt.builder.controller.requests.PatchBuilderAddressRequest
import com.br.asbuilt.builder.controller.requests.PatchBuilderNameRequest
import com.br.asbuilt.builder.controller.requests.PatchBuilderPhoneRequest
import com.br.asbuilt.builder.controller.responses.BuilderResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/builder")
class BuilderController(val service: BuilderService) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/insertBuilder")
    fun insert(@Valid @RequestBody builder: CreateBuilderRequest) =
        BuilderResponse(service.insert(builder.toBuilder()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateBuilderName/{id}")
    fun updateName(
        @Valid
        @RequestBody request: PatchBuilderNameRequest,
        @PathVariable id: Long,
    ): ResponseEntity <BuilderResponse> {
        return service.updateName(id, request.builderName)
            ?.let{ ResponseEntity.ok(BuilderResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateBuilderAddress/{id}")
    fun updateAddress(
        @Valid
        @RequestBody request: PatchBuilderAddressRequest,
        @PathVariable id: Long,
    ): ResponseEntity <BuilderResponse> {
        return service.updateAddress(id, request.builderAddress)
            ?.let{ ResponseEntity.ok(BuilderResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateBuilderPhone/{id}")
    fun updatePhone(
        @Valid
        @RequestBody request: PatchBuilderPhoneRequest,
        @PathVariable id: Long,
    ): ResponseEntity <BuilderResponse> {
        return service.updatePhone(id, request.builderPhone)
            ?.let{ ResponseEntity.ok(BuilderResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
            .map { BuilderResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/getBuilderByName/{builderName}")
    fun getByName(@PathVariable builderName: String) =
        service.findByName(builderName)
            ?.let { ResponseEntity.ok(BuilderResponse(it)) }
            ?: ResponseEntity.notFound().build()

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        if (service.delete(id)) ResponseEntity.ok().build()
        else ResponseEntity.notFound().build()
}