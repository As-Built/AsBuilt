package com.br.asbuilt

import com.br.asbuilt.address.Address
import com.br.asbuilt.address.AddressRepository
import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.mail.MailService
import com.br.asbuilt.roles.Role
import com.br.asbuilt.roles.RoleRepository
import com.br.asbuilt.security.Jwt
import com.br.asbuilt.users.User
import com.br.asbuilt.users.UserRepository
import com.br.asbuilt.users.UserService
import com.br.asbuilt.users.controller.requests.PatchUserRequest
import com.br.asbuilt.users.controller.responses.LoginResponse
import com.br.asbuilt.users.controller.responses.UserResponse
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.assertions.throwables.shouldThrow
import io.mockk.*
import org.springframework.data.domain.Sort
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.util.*

class UserServiceTest : StringSpec({

    lateinit var userRepository: UserRepository
    lateinit var roleRepository: RoleRepository
    lateinit var addressRepository: AddressRepository
    lateinit var mailService: MailService
    lateinit var jwt: Jwt
    lateinit var passwordEncoder: BCryptPasswordEncoder
    lateinit var userService: UserService

    beforeEach {
        userRepository = mockk()
        roleRepository = mockk()
        addressRepository = mockk()
        mailService = mockk()
        jwt = mockk()
        passwordEncoder = mockk()
        userService = UserService(userRepository, roleRepository, addressRepository, jwt, passwordEncoder, mailService, userRepository)
    }

    "should insert user" {
        val user = User(
            id = 1L,
            name = "John Doe",
            email = "john.doe@example.com",
            cpf = "12345678901",
            password = "password123",
            phone = "123456789",
            userAddress = Address(id = 1L)
        )
        val roleFuncionario = Role(id = 1L, name = "FUNCIONARIO")

        every { userRepository.findByCPF(user.cpf) } returns null
        every { userRepository.findByEmail(user.email) } returns null
        every { roleRepository.findByName("FUNCIONARIO") } returns roleFuncionario
        every { userRepository.save(user) } returns user

        val createdUser = userService.insert(user)

        createdUser shouldNotBe null
        createdUser.name shouldBe user.name
        createdUser.email shouldBe user.email
        verify(exactly = 1) { userRepository.save(user) }
    }

    "should throw BadRequestException when user with same CPF already exists" {
        val user = User(id = 1L, name = "John Doe", email = "john.doe@example.com", cpf = "12345678901", password = "password123")

        every { userRepository.findByCPF(user.cpf) } returns user

        shouldThrow<BadRequestException> {
            userService.insert(user)
        }
        verify(exactly = 1) { userRepository.findByCPF(user.cpf) }
    }

    "should update user" {
        val userRequest = PatchUserRequest(
            id = 1L,
            name = "John Updated",
            email = "john.updated@example.com",
            phone = "987654321",
            cpf = "12345678901",
            userAddress = Address(id = 1L, street = "Rua X", number = 123, city = "Cidade Y", state = "Estado Z", postalCode = "12345-678"),
            photo = "photo_data",
            salaries = setOf(1L)
        )

        val existingUser = User(
            id = 1L,
            name = "John Doe",
            email = "john.doe@example.com",
            cpf = "12345678901",
            password = "password123",
            phone = "987654321",
            userAddress = Address(id = 1L, street = "Rua X", number = 123, city = "Cidade Y", state = "Estado Z", postalCode = "12345-678"),
            photo = "photo_data"
        )

        every { userRepository.findById(userRequest.id) } returns Optional.of(existingUser)
        every { addressRepository.save(any()) } returns Address(id = 1L)
        every { userRepository.save(any()) } returns existingUser

        val updatedUser = userService.update(userRequest)

        updatedUser shouldNotBe null
        updatedUser?.name shouldBe userRequest.name
        updatedUser?.email shouldBe userRequest.email
        updatedUser?.phone shouldBe userRequest.phone
        updatedUser?.cpf shouldBe userRequest.cpf
        updatedUser?.userAddress?.id shouldBe userRequest.userAddress.id
        updatedUser?.photo shouldBe userRequest.photo

        verify(exactly = 1) { userRepository.save(existingUser) }
    }


    "should throw NotFoundException when user not found for update" {
        val userRequest = PatchUserRequest(
            id = 1L,
            name = "John Updated",
            email = "john.updated@example.com",
            phone = "987654321",
            cpf = "12345678901",
            userAddress = Address(id = 1L, street = "Rua X", number = 123, city = "Cidade Y", state = "Estado Z", postalCode = "12345-678"),
            photo = "photo_data",
            salaries = setOf(1L)
        )

        every { userRepository.findById(userRequest.id) } returns Optional.empty()

        shouldThrow<NotFoundException> {
            userService.update(userRequest)
        }

        verify(exactly = 1) { userRepository.findById(userRequest.id) }
    }


    "should find all users in ascending order" {
        val user1 = User(id = 1L, name = "John", email = "john@example.com", cpf = "11111111111", password = "pass")
        val user2 = User(id = 2L, name = "Alice", email = "alice@example.com", cpf = "22222222222", password = "pass")

        every { userRepository.findAll(Sort.by("name").ascending()) } returns listOf(user2, user1)

        val users = userService.findAll(SortDir.ASC)

        users.size shouldBe 2
        users[0].name shouldBe "Alice"
        users[1].name shouldBe "John"

        verify(exactly = 1) { userRepository.findAll(Sort.by("name").ascending()) }
    }

    "should find user by id or null" {
        val user = User(id = 1L, name = "John Doe", email = "john.doe@example.com", cpf = "12345678901", password = "password123")
        every { userRepository.findById(1L) } returns Optional.of(user)

        val foundUser = userService.findByIdOrNull(1L)

        foundUser shouldBe user
        verify(exactly = 1) { userRepository.findById(1L) }
    }

    "should delete user" {
        val user = User(id = 1L, name = "John Doe", email = "john.doe@example.com", cpf = "12345678901", password = "password123")
        every { userRepository.findById(1L) } returns Optional.of(user)
        every { userRepository.delete(user) } just Runs

        val deleted = userService.delete(1L)

        deleted shouldBe true
        verify(exactly = 1) { userRepository.delete(user) }
    }

    "should throw BadRequestException when trying to delete last admin" {
        val user = User(id = 1L, name = "Admin User", email = "admin@example.com", cpf = "12345678901", password = "password123")
        user.roles.add(Role(name = "ADMIN"))
        every { userRepository.findById(1L) } returns Optional.of(user)
        every { userRepository.findByRole("ADMIN") } returns listOf(user)

        shouldThrow<BadRequestException> {
            userService.delete(1L)
        }
    }

    "should login user successfully" {
        val email = "john.doe@example.com"
        val password = "password123"
        val user = User(id = 1L, email = email, password = password)
        val loginResponse = LoginResponse(token = "some-token", user = UserResponse(user))

        every { userRepository.findByEmail(email) } returns user
        every { passwordEncoder.matches(password, user.password) } returns true
        every { jwt.createToken(user) } returns "some-token"

        val response = userService.login(email, password)

        response shouldBe loginResponse
        verify(exactly = 1) { userRepository.findByEmail(email) }
    }

    "should return null when login fails" {
        val email = "john.doe@example.com"
        val password = "wrong-password"
        val user = User(id = 1L, email = email, password = "password123")

        every { userRepository.findByEmail(email) } returns user
        every { passwordEncoder.matches(password, user.password) } returns false

        val response = userService.login(email, password)

        response shouldBe null
        verify(exactly = 1) { userRepository.findByEmail(email) }
    }

    "should send password recovery email" {
        val email = "john.doe@example.com"
        val user = User(id = 1L, email = email, password = "password123")

        every { userRepository.findByEmail(email) } returns user
        every { mailService.enviarEmailTexto(email, "Recuperação de senha", "Sua senha é: password123") } returns mailService.toString()

        val result = userService.recuperarSenha(email)

        result shouldBe mailService
        verify(exactly = 1) { mailService.enviarEmailTexto(email, "Recuperação de senha", "Sua senha é: password123") }
    }

    "should throw NotFoundException when user not found for password recovery" {
        val email = "john.doe@example.com"

        every { userRepository.findByEmail(email) } returns null

        shouldThrow<NotFoundException> {
            userService.recuperarSenha(email)
        }
    }
})
