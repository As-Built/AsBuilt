package com.br.asbuilt.address;

import jakarta.persistence.*;

@Entity
@Table(name="TblAddress")
class Address (
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(name = "RUA")
    var street: String? = null,

    @Column(name = "NUMERO")
    var number: Int? = null,

    @Column(name = "CIDADE")
    var city: String? = null,

    @Column(name = "ESTADO")
    var state: String? = null,

    @Column(name = "CEP")
    var postalCode: String? = null
) {}
