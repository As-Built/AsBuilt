package com.br.asbuilt.users

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): User?

    @Query("SELECT DISTINCT u FROM User u" +
            " JOIN u.roles r" +
            " WHERE r.name = :role" +
            " ORDER BY u.name")
    fun findByRole(role: String): List<User>

    @Query("SELECT DISTINCT u FROM User u" +
            " WHERE u.cpf = :cpf")
    fun findByCPF(cpf: String): User?
}