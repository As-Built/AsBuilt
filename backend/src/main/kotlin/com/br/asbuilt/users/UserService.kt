package com.br.asbuilt.users

import com.br.asbuilt.SortDir
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.roles.RoleRepository
import com.br.asbuilt.security.Jwt
import com.br.asbuilt.users.controller.responses.LoginResponse
import com.br.asbuilt.users.controller.responses.UserResponse
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class UserService(
    val repository: UserRepository,
    val roleRepository: RoleRepository,
    val jwt: Jwt
) {
    fun insert(user: User): User {
        if ((repository.findByEmail(user.email) != null) || (repository.findByCPF(user.cpf) != null)) {
            log.info("User with same email or CPF already exists")
            throw BadRequestException("User already exists")
        } else {
            return repository.save(user)
                .also { log.info("User inserted: {}", it.id) }
        }
    }

    fun update(id: Long, name: String): User? {
        val user = findByIdOrThrow(id)
        if (user.name == name) return null
        user.name = name
        return repository.save(user)
    }

    fun findAll(dir: SortDir = SortDir.ASC): List<User> = when (dir) {
        SortDir.ASC -> repository.findAll(Sort.by("name").ascending())
        SortDir.DESC -> repository.findAll(Sort.by("name").descending())
    }

    fun findByRole(role: String): List<User> = repository.findByRole(role)

    fun findByIdOrNull(id: Long) = repository.findById(id).getOrNull()
    private fun findByIdOrThrow(id: Long) =
        findByIdOrNull(id) ?: throw NotFoundException(id)

    fun delete(id: Long): Boolean {
        val user = findByIdOrNull(id) ?: return false
        if (user.roles.any { it.name == "ADMIN" }) {
            val count = repository.findByRole("ADMIN").size
            if (count == 1) throw BadRequestException("Cannot delete the last system admin!")
        }
        repository.delete(user)
        log.info("User deleted: {}", user.id)
        return true
    }

    fun addRole(id: Long, roleName: String): Boolean {
        val user = findByIdOrThrow(id)
        if (user.roles.any { it.name == roleName }) return false

        val role = roleRepository.findByName(roleName) ?: throw BadRequestException("Invalid role: $roleName")

        user.roles.add(role)
        repository.save(user)
        log.info("Granted role {} to user {}", role.name, user.id)
        return true
    }

    fun login(email: String, password: String): LoginResponse? {
        val user = repository.findByEmail(email) ?: return null
        if (user.password != password) return null

        log.info("User logged in. id={}, name={}", user.id, user.name)
        return LoginResponse(
            token = jwt.createToken(user),
            user = UserResponse(user)
        )
    }

    fun findByCpf(cpf: String): User? = repository.findByCPF(cpf)

    fun findByEmail(email: String): User? = repository.findByEmail(email)

    companion object {
        private val log = LoggerFactory.getLogger(UserService::class.java)
    }
}
