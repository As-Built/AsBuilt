package com.br.asbuilt.productionValue

import com.br.asbuilt.assessment.Assessment
import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import jakarta.persistence.*
import java.util.*


@Entity
@Table(name = "TblProductionValue")
class ProductionValue (
    @Id @GeneratedValue
    var id: Long? = null,

    @Column(nullable = true)
    var value: Double = 0.0,

    @Column(nullable = false)
    var date: Date = Date(),

    @ManyToOne
    @JoinTable(
        name = "UserProductionValue",
        joinColumns = [JoinColumn(name = "idProductionValue")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var user: User,

    @ManyToOne
    @JoinTable(
        name = "TaskProductionValue",
        joinColumns = [JoinColumn(name = "idProductionValue")],
        inverseJoinColumns = [JoinColumn(name = "idTask")]
    )
    var task: Task,

    @ManyToOne
    @JoinTable(
        name = "AssessmentProductionValue",
        joinColumns = [JoinColumn(name = "idProductionValue")],
        inverseJoinColumns = [JoinColumn(name = "idAssessment")]
    )
    var assessment: Assessment,

    @Column(nullable = false)
    var assessmentPercentage: Double = 0.0
)