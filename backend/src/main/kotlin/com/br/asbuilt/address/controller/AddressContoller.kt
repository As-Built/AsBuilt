package com.br.asbuilt.address.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.address.AddressService
import com.br.asbuilt.address.controller.requests.CreateAddressRequest
import com.br.asbuilt.address.controller.responses.AddressResponse
import com.br.asbuilt.users.controller.responses.UserResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/address")
class AddressContoller(val service: AddressService){

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @PostMapping("/insertAddress")
    fun insert(@Valid @RequestBody address: CreateAddressRequest) =
        AddressResponse(service.insert(address.toAddress()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @GetMapping
    fun list(@RequestParam sortDir: String? = null) =
        service.findAll()
        .map { AddressResponse(it) }.let { ResponseEntity.ok(it) }

}