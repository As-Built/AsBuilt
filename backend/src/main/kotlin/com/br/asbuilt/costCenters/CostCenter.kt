package com.br.asbuilt.costCenters

import com.br.asbuilt.address.Address
import jakarta.persistence.*

@Entity
@Table(name = "TblCostCenter")
class CostCenter(
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(name = "NOME_CENTRO_DE_CUSTO", nullable = false)
    var nomeCentroDeCusto: String,

    @OneToOne
    @JoinTable(
        name = "CostCenterAddress",
        joinColumns = [JoinColumn(name = "idCostCenter")],
        inverseJoinColumns = [JoinColumn(name = "idAddress")]
    )
    var enderecoCentroDeCusto: Address,

    @Column(name = "VALOR_EMPREENDIDO")
    var valorEmpreendido: Double
)