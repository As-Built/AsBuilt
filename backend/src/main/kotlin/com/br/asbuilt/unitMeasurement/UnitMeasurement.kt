package com.br.asbuilt.unitMeasurement

import jakarta.persistence.*

@Entity(name = "TblUnitMeasurement")
class UnitMeasurement (

    @Id @GeneratedValue
    var id: Long? = null,

    var name: String,

    var description: String
)