package com.br.asbuilt.roles

import com.br.asbuilt.users.User
import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*

@Entity
class Role(
    @Id @GeneratedValue
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    val name: String,

    @Column(nullable = false)
    val description: String = "",

    @ManyToMany(mappedBy = "roles")
    @JsonBackReference
    val users: MutableSet<User> = mutableSetOf()
)