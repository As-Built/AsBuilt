package com.br.asbuilt.builders.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.builders.BuilderService
import com.br.asbuilt.builders.controller.requests.CreateBuilderRequest
import com.br.asbuilt.builders.controller.requests.PatchBuilderRequest
import com.br.asbuilt.builders.controller.responses.BuilderResponse
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
    @PatchMapping("/updateBuilder")
    fun updateBuilder(@Valid @RequestBody builder: PatchBuilderRequest) =
        BuilderResponse(service.updateBuilder(builder.toBuilder())!!)
            .let{ ResponseEntity.status(HttpStatus.OK).body(it) }

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
    @DeleteMapping("/deleteBuilder/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        if (service.delete(id)) ResponseEntity.ok().build()
        else ResponseEntity.notFound().build()
}