package com.br.asbuilt.tasks

import com.br.asbuilt.assessment.Assessment
import com.br.asbuilt.costCenters.CostCenter
import com.br.asbuilt.locations.Location
import com.br.asbuilt.taskTypes.TaskType
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import com.br.asbuilt.users.User
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "TblTask")
class Task(
    @Id @GeneratedValue
    var id: Long? = null,

    @ManyToOne
    @JoinTable(
        name = "TaskTypeTask",
        joinColumns = [JoinColumn(name = "idTask")],
        inverseJoinColumns = [JoinColumn(name = "idTaskType")]
    )
    var taskType: TaskType,

    @Column(nullable = false)
    var unitaryValue: Double,

    @Column(nullable = false)
    var dimension: Double,

    @ManyToOne
    @JoinTable(
        name = "TaskUnitMeasurement",
        joinColumns = [JoinColumn(name = "idTask")],
        inverseJoinColumns = [JoinColumn(name = "idUnitMeasurement")]
    )
    var unitMeasurement: UnitMeasurement,

    @ManyToOne
    @JoinTable(
        name = "CostCenterTask",
        joinColumns = [JoinColumn(name = "idTask")],
        inverseJoinColumns = [JoinColumn(name = "idCostCenter")]
    )
    var costCenter: CostCenter,

    @ManyToOne
    @JoinTable(
        name = "TaskLocation",
        joinColumns = [JoinColumn(name = "idTask")],
        inverseJoinColumns = [JoinColumn(name = "idLocation")]
    )
    var taskLocation: Location,

    @Column(nullable = false)
    var expectedStartDate: Date,

    var startDate: Date?,

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
    var executors: MutableSet<User> = mutableSetOf(),

    @ManyToMany
    @JoinTable(
        name = "TaskEvaluator",
        joinColumns = [JoinColumn(name = "idTask")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var evaluators: MutableSet<User> = mutableSetOf(),

    @OneToMany
    val assessments: MutableSet<Assessment> = mutableSetOf()


)