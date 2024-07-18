package com.br.asbuilt.users.controller

import com.br.asbuilt.SortDir
import com.br.asbuilt.exception.ForbiddenException
import com.br.asbuilt.security.UserToken
import com.br.asbuilt.users.UserService
import com.br.asbuilt.users.controller.requests.CreateUserRequest
import com.br.asbuilt.users.controller.requests.LoginRequest
import com.br.asbuilt.users.controller.requests.PatchUserRequest
import com.br.asbuilt.users.controller.responses.UserResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController(val service: UserService) {
    @PostMapping
    fun insert(@Valid @RequestBody user: CreateUserRequest) =
        UserResponse(service.insert(user.toUser()))
            .let { ResponseEntity.status(HttpStatus.CREATED).body(it) }

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("permitAll()")
    @PatchMapping("/updateUser")
    fun update(
        @Valid @RequestBody request: PatchUserRequest,
        auth: Authentication
    ): ResponseEntity<UserResponse> {
        //TODO: Implementar a criação de endereço
        return service.update(request)
            ?.let { ResponseEntity.ok(UserResponse(it)) }
            ?: ResponseEntity.noContent().build()
    }

    @GetMapping
    fun list(@RequestParam sortDir: String? = null, @RequestParam role: String? = null) =
        if (role == null) {
            service.findAll(SortDir.findOrThrow(sortDir ?: "ASC"))
        } else {
            service.findByRole(role.uppercase())
        }.map { UserResponse(it) }.let { ResponseEntity.ok(it) }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) =
        service.findByIdOrNull(id)
            ?.let { ResponseEntity.ok(UserResponse(it)) }
            ?: ResponseEntity.notFound().build()

    @SecurityRequirement(name="AsBuilt")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        if (service.delete(id)) ResponseEntity.ok().build()
        else ResponseEntity.notFound().build()

    @PutMapping("/{id}/roles/{role}")
    fun grant(@PathVariable id: Long, @PathVariable role: String): ResponseEntity<Void> =
        if (service.addRole(id, role.uppercase())) {
            ResponseEntity.ok().build()
        } else {
            ResponseEntity.noContent().build()
        }

    @PostMapping("/login")
    fun login(@Valid @RequestBody login: LoginRequest) =
        service.login(login.email!!, login.password!!)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

    @GetMapping("/findByCpf/{cpf}")
    fun getByCpf(@PathVariable cpf: String) =
        service.findByCpf(cpf)
            ?.let { ResponseEntity.ok(UserResponse(it)) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/findByEmail/{email}")
    fun getByEmail(@PathVariable email: String) =
        service.findByEmail(email)
            ?.let { ResponseEntity.ok(UserResponse(it)) }
            ?: ResponseEntity.notFound().build()

    @PostMapping("/recuperarSenha/{email}")
    @PreAuthorize("permitAll()")
    fun recuperarSenha(@PathVariable email: String): ResponseEntity<Void> =
        service.recuperarSenha(email)
            .let { ResponseEntity.ok().build() }
}