package com.br.asbuilt.users

import com.br.asbuilt.address.Address
import com.br.asbuilt.roles.Role
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Entity
@Table(name = "TblUser")
class User(
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(unique = true)
    var email: String = "",

    @JsonIgnore
    @Column(nullable = false)
    var password: String = "",

    @Column(nullable = false)
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

    @Lob
    var photo: String? = null,

    @ManyToMany
    @JoinTable(
        name="UserRole",
        joinColumns = [JoinColumn(name = "idUser")],
        inverseJoinColumns = [JoinColumn(name = "idRole")]
    )
    val roles: MutableSet<Role> = mutableSetOf()
) : ApplicationContextAware {
    @get:JsonIgnore
    @get:Transient
    val isAdmin: Boolean get() = roles.any { it.name == "ADMIN" }

    companion object {
        @Transient
        private var applicationContext: ApplicationContext? = null

        fun getBCryptPasswordEncoder(): BCryptPasswordEncoder =
            applicationContext?.getBean(BCryptPasswordEncoder::class.java) ?: throw IllegalStateException("Application context is not set")
    }

    override fun setApplicationContext(applicationContext: ApplicationContext) {
        User.applicationContext = applicationContext
    }

    @PrePersist
    @PreUpdate
    private fun hashPassword() {
        if (this.password.isNotEmpty() && !this.password.startsWith("\$2a\$")) {
            this.password = getBCryptPasswordEncoder().encode(this.password)
        }
    }
}