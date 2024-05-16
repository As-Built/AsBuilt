package com.br.asbuilt.locations

import jakarta.persistence.*

@Entity
@Table(name = "TblLocation")
class Location (
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(nullable = false)
    var locationGroup: String,

    var subGroup1: String?,

    var subGroup2: String?,

    var subGroup3: String?

)