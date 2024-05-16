package com.br.asbuilt.tasks

import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.locations.Location
import com.br.asbuilt.users.User
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "TblTask")
class Task(
    @Id @GeneratedValue
    var id: Long? = null,

    @Column( nullable = false)
    var taskType: String,

    @Column(nullable = false)
    var unitaryValue: Double,

    @Column(nullable = false)
    var dimension: Double,

    @Column(nullable = false)
    var unitMeasurement: String,

    @ManyToOne
    @JoinColumn(name = "idCostCenter")
    var costCenter: CostCenter,

    @ManyToOne
    @JoinColumn(name= "idLocation")
    var taskLocation: Location,

    @Column(nullable = false)
    var startDate: Date,

    @Column(nullable = false)
    var expectedEndDate: Date,

    var finalDate: Date?,

    var amount: Double,

    var obs: String?,

    @ManyToMany
    @JoinTable(
        name = "TaskExecutor",
        joinColumns = [JoinColumn(name = "idTask")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var executor: MutableSet<User> = mutableSetOf(),

    @ManyToMany
    @JoinTable(
        name = "TaskConferente",
        joinColumns = [JoinColumn(name = "idTask")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var conferente: MutableSet<User> = mutableSetOf()


)