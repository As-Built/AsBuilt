package com.br.asbuilt.salary

import com.br.asbuilt.exception.BadRequestException
import com.br.asbuilt.exception.NotFoundException
import com.br.asbuilt.salary.controller.requests.CreateSalaryRequest
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class SalaryService (
    val repository: SalaryRepository,
    val userRepository: UserRepository
) {

    fun insert(salaryRequest: CreateSalaryRequest): Salary {
        if (salaryRequest.value <= 0) {
            throw BadRequestException("Salary value must be greater than 0")
        }
        if (salaryRequest.user == null) {
            throw BadRequestException("Salary must have a user")
        }

        val user = salaryRequest.user.id.let {
            userRepository.findById(it!!)
                .orElseThrow { NotFoundException("User not found with ID: ${salaryRequest.user.id}") }
        }

        val newSalary = salaryRequest.toSalary(
            user = user!!
        )

        // Adiciona o novo salário a coleção de salários do usuário
        user.salaries?.add(newSalary)

        return repository.save(newSalary)
            // Salva o usuário para realizar o update da tabela tbl_user_salaries
            .also { userRepository.save(user) }
            .also { log.info("Salary inserted for the User Id: {}, with Salary ID {}", it.user!!.id, it.id) }
    }

    fun sumLatestSalaries(): Double {
        return repository.sumLatestSalaries() ?: 0.0
    }

    companion object {
        private val log = LoggerFactory.getLogger(SalaryService::class.java)
    }

}