package com.br.asbuilt.costCenters

import com.br.asbuilt.address.Address
import jakarta.persistence.*

@Entity
@Table(name = "TblCostCenter")
class CostCenter(
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(name = "COST_CENTER_NAME", nullable = false)
    var costCenterName: String,

    @OneToOne
    @JoinTable(
        name = "CostCenterAddress",
        joinColumns = [JoinColumn(name = "idCostCenter")],
        inverseJoinColumns = [JoinColumn(name = "idAddress")]
    )
    var costCenterAddress: Address,

    @Column(name = "VALUE_UNDERTAKEN")
    var valueUndertaken: Double,

    @Column(name = "OWNER")
    var owner: String,
)