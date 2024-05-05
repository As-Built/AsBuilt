package com.br.asbuilt.users

import com.br.asbuilt.address.Address
import com.br.asbuilt.roles.Role
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "TblUser")
class User(
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(unique = true)
    var email: String = "",

    var password: String = "",

    var name: String = "",

    @Column(unique = true)
    var cpf: String = "",

    @ManyToOne
    @JoinTable(
        name = "UserAddress",
        joinColumns = [JoinColumn(name = "idUser")],
        inverseJoinColumns = [JoinColumn(name = "idAddress")]
    )
    var userAddress: Address? = null,

    var phone: String = "",

    @ManyToMany
    @JoinTable(
        name="UserRole",
        joinColumns = [JoinColumn(name = "idUser")],
        inverseJoinColumns = [JoinColumn(name = "idRole")]
    )
    val roles: MutableSet<Role> = mutableSetOf()
) {
    @get:JsonIgnore
    @get:Transient
    val isAdmin: Boolean get() = roles.any { it.name == "ADMIN" }
}