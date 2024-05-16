package com.br.asbuilt.costCenters

import com.br.asbuilt.address.Address
import com.br.asbuilt.builders.Builder
import jakarta.persistence.*

@Entity
@Table(name = "TblCostCenter")
class CostCenter(
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(nullable = false)
    var costCenterName: String,

    @OneToOne
    @JoinTable(
        name = "CostCenterAddress",
        joinColumns = [JoinColumn(name = "idCostCenter")],
        inverseJoinColumns = [JoinColumn(name = "idAddress")]
    )
    var costCenterAddress: Address,

    var valueUndertaken: Double,

    var expectedBudget: Double,

    @ManyToOne
    @JoinTable(
        name = "BuilderCostCenter",
        joinColumns = [JoinColumn(name = "idCostCenter")],
        inverseJoinColumns = [JoinColumn(name = "idBuilder")]
    )
    var builder: Builder
)