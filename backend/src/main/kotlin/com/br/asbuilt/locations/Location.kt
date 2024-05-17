package com.br.asbuilt.locations

import com.br.asbuilt.costCenters.CostCenter
import jakarta.persistence.*

@Entity
@Table(name = "TblLocation")
class Location (
    @Id @GeneratedValue
    var id: Long? = null,

    @ManyToOne
    @JoinTable(
        name = "LocationTaskCostCenter",
        joinColumns = [JoinColumn(name = "idLocation")],
        inverseJoinColumns = [JoinColumn(name = "idCostCenter")]
    )
    var costCenter: CostCenter,

    @Column(nullable = false)
    var locationGroup: String,

    var subGroup1: String?,

    var subGroup2: String?,

    var subGroup3: String?

)