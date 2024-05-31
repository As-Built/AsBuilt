package com.br.asbuilt.locations.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.locations.LocationService
import com.br.asbuilt.locations.controller.requests.CreateLocationRequest
import com.br.asbuilt.locations.controller.requests.PatchLocationRequest
import com.br.asbuilt.locations.controller.responses.LocationResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/location")
class LocationController(val service: LocationService) {

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PostMapping("/insertLocation")
    fun insert(@Valid @RequestBody location: CreateLocationRequest) =
        LocationResponse(service.insert(location.toLocation()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @PatchMapping("/updateLocation")
    fun updateCostCenter(@Valid @RequestBody request: PatchLocationRequest) =
        LocationResponse(service.updateLocation(request.toLocation())!!)
            .let{ ResponseEntity.status(HttpStatus.OK).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
            .map { LocationResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findLocationByGroup/{locationGroup}")
    fun findLocationByGroup(@PathVariable locationGroup: String) =
        service.findLocationByGroup(locationGroup)
            .map { LocationResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findLocationBySubGroup1/{subGroup1}")
    fun findLocationBySubGroup1(@PathVariable subGroup1: String) =
        service.findLocationBySubGroup1(subGroup1)
            .map { LocationResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findLocationBySubGroup2/{subGroup2}")
    fun findLocationBySubGroup2(@PathVariable subGroup2: String) =
        service.findLocationBySubGroup2(subGroup2)
            .map { LocationResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findLocationBySubGroup3/{subGroup3}")
    fun findLocationBySubGroup3(@PathVariable subGroup3: String) =
        service.findLocationBySubGroup2(subGroup3)
            .map { LocationResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @GetMapping("/findLocationByCostCenter/{costCenterId}")
    fun findLocationByCostCenterId(@PathVariable costCenterId: Long) =
        service.findLocationByCostCenterId(costCenterId)
            .map { LocationResponse(it) }.let { ResponseEntity.ok(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN') || hasRole('CONFERENTE')")
    @DeleteMapping("/deleteLocation/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        if (service.delete(id)) ResponseEntity.ok().build()
        else ResponseEntity.notFound().build()
}