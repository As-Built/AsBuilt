package com.br.asbuilt.users

import com.br.asbuilt.SortDir
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.mail.MailService
import com.br.asbuilt.roles.RoleRepository
import com.br.asbuilt.security.Jwt
import com.br.asbuilt.users.controller.requests.PatchUserRequest
import com.br.asbuilt.users.controller.responses.LoginResponse
import com.br.asbuilt.users.controller.responses.UserResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class UserService(
    val repository: UserRepository,
    val roleRepository: RoleRepository,
    val addressRepository: AddressRepository,
    val jwt: Jwt,
    val passwordEncoder: BCryptPasswordEncoder,

    @Autowired
    val mailService: MailService,
    private val userRepository: UserRepository
) {

    fun insert(user: User): User {
        if (repository.findByCPF(user.cpf) != null) {
            log.info("A user with same CPF already exists")
            throw BadRequestException("A user with same CPF already exists")
        }
        else if (repository.findByEmail(user.email) != null) {
            log.info("A user with same EMAIL already exists")
            throw BadRequestException("A user with same EMAIL already exists")
        } else {
            val roleFuncionario = roleRepository.findByName("FUNCIONARIO")
                ?: throw BadRequestException("Role FUNCIONARIO does not exist")
            user.roles.add(roleFuncionario)
            return repository.save(user)
                .also { log.info("User inserted: {}", it.id) }
        }
    }

    fun update(userRequest: PatchUserRequest): User? {
        val existingUser = userRequest.id.let {
            repository.findById(it)
                .orElseThrow { NotFoundException("User not found with id: ${userRequest.id}") }
        }
        if (existingUser != null) {
            var isChanged = false

            if (userRequest.name != existingUser.name) {
                existingUser.name = userRequest.name
                isChanged = true
            }

            if (userRequest.email != existingUser.email) {
                existingUser.email = userRequest.email
                isChanged = true
            }

            if (userRequest.cpf != existingUser.cpf) {
                existingUser.name = userRequest.name
                isChanged = true
            }

            if (userRequest.phone != existingUser.phone) {
                existingUser.phone = userRequest.phone
                isChanged = true
            }

            if (userRequest.userAddress != existingUser.userAddress) {
                existingUser.userAddress = userRequest.userAddress
                isChanged = true
            }

            if (isChanged) {

                val newAddress = userRequest.userAddress
                newAddress.id = userRequest.userAddress.id

                val savedAddress = addressRepository.save(newAddress)
                    .also { log.info("Address updated: {}", it.id)}
                userRequest.userAddress = savedAddress

                val updateUser = repository.save(existingUser)
                log.info("User updated: {}", updateUser.id)
                return updateUser
            }
        }
        return null
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
        if (!passwordEncoder.matches(password, user.password)) return null // Usar matches para comparar as senhas

        log.info("User logged in. id={}, name={}", user.id, user.name)
        return LoginResponse(
            token = jwt.createToken(user),
            user = UserResponse(user)
        )
    }

    fun findByCpf(cpf: String): User? = repository.findByCPF(cpf)

    fun findByEmail(email: String): User? = repository.findByEmail(email)

    fun recuperarSenha(email: String): MailService {
        val user = findByEmail(email) ?: throw NotFoundException("User not found")
        mailService.enviarEmailTexto(
            user.email,
            "Recuperação de senha",
            "Sua senha é: ${user.password}"
        )
        return mailService
    }

    companion object {
        private val log = LoggerFactory.getLogger(UserService::class.java)
    }
}
