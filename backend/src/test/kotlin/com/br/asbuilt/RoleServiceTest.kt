package com.br.asbuilt

import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.roles.Role
import com.br.asbuilt.roles.RoleRepository
import com.br.asbuilt.roles.RoleService
import io.mockk.*
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.kotest.assertions.throwables.shouldThrow
import org.springframework.data.domain.Sort

class RoleServiceTest : StringSpec({

    val roleRepository = mockk<RoleRepository>()
    val roleService = RoleService(roleRepository)

    "should throw BadRequestException when role already exists" {
        val role = Role(id = 1L, name = "ADMIN")

        every { roleRepository.findByName(role.name) } returns role

        val exception = shouldThrow<BadRequestException> {
            roleService.insert(role)
        }

        exception.message shouldBe "Role already exists"

        verify(exactly = 1) { roleRepository.findByName(role.name) }
    }

    "should find all roles in ascending order" {
        val role1 = Role(id = 1L, name = "USER")
        val role2 = Role(id = 2L, name = "ADMIN")

        every { roleRepository.findAll(Sort.by("name").ascending()) } answers {
            listOf(role1, role2).sortedBy { it.name }
        }

        val roles = roleService.findAll()

        roles.size shouldBe 2
        roles[0].name shouldBe "ADMIN"
        roles[1].name shouldBe "USER"

        verify(exactly = 1) { roleRepository.findAll(Sort.by("name").ascending()) }
    }
})
