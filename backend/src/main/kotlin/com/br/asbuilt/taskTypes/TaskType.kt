package com.br.asbuilt.taskTypes

import com.br.asbuilt.unitMeasurement.UnitMeasurement
import jakarta.persistence.*

@Entity
@Table(name = "tblTaskType")
class TaskType (

    @Id
    @GeneratedValue
    var id: Long? = null,

    @Column(nullable = false)
    var taskTypeName: String,

    @Column(nullable = false)
    var taskTypeDescription: String,

    @ManyToOne
    @JoinTable(
        name = "TaskTypeUnitMeasurement",
        joinColumns = [JoinColumn(name = "idTaskType")],
        inverseJoinColumns = [JoinColumn(name = "idUnitMeasurement")]
    )
    var unitMeasurement: UnitMeasurement,

    @Column(nullable = false)
    var parameter0Name: String,

    @Column(nullable = false)
    var parameter1Name: String,

    @Column(nullable = false)
    var parameter2Name: String,

    var parameter3Name: String?,

    var parameter4Name: String?,

    var parameter5Name: String?,

    var parameter6Name: String?,

    var parameter7Name: String?,

    var parameter8Name: String?,

    var parameter9Name: String?,

    var comments: String?
)