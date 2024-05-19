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
        joinColumns = [JoinColumn(name = "idTaskTÿpe")],
        inverseJoinColumns = [JoinColumn(name = "idUnitMeasurement")]
    )
    var unitMeasurement: UnitMeasurement,

    @Column(nullable = false)
    var parameter0Name: String,

    @Column(nullable = false)
    var parameter0Result: Boolean,

    @Column(nullable = false)
    var parameter1Name: String,

    @Column(nullable = false)
    var parameter1Result: Boolean,

    @Column(nullable = false)
    var parameter2Name: String,

    @Column(nullable = false)
    var parameter2Result: Boolean,

    var parameter3Name: String?,

    var parameter3Result: Boolean?,

    var parameter4Name: String?,

    var parameter4Result: Boolean?,

    var parameter5Name: String?,

    var parameter5Result: Boolean?,

    var parameter6Name: String?,

    var parameter6Result: Boolean?,

    var parameter7Name: String?,

    var parameter7Result: Boolean?,

    var parameter8Name: String?,

    var parameter8Result: Boolean?,

    var parameter9Name: String?,

    var parameter9Result: Boolean?,

    var comments: String?
)