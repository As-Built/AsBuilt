package com.br.asbuilt.builder

import com.br.asbuilt.address.Address
import jakarta.persistence.*

@Entity
@Table(name = "TblBuilder")
class Builder (
    @Id @GeneratedValue
    var id: Long? = null,

    var builderName: String = "",

    @Column(unique = true)
    var cnpj: String = "",

    var phone: String? = "",

    @OneToOne
    @JoinTable(
        name = "BuilderAddress",
        joinColumns = [JoinColumn(name = "idBuilder")],
        inverseJoinColumns = [JoinColumn(name = "idAddress")]
    )
    var builderAddress: Address,
)