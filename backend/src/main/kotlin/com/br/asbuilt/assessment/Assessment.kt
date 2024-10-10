package com.br.asbuilt.assessment

import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name = "TblAssessment")
class Assessment(

    @Id
    @GeneratedValue
    var id: Long? = null,

    @ManyToOne
    @JoinTable(
        name = "AssessmentTask",
        joinColumns = [JoinColumn(name = "idAssessment")],
        inverseJoinColumns = [JoinColumn(name = "idTask")]
    )
    var task: Task?,

    @ManyToMany
    @JoinTable(
        name = "AssessmentTaskExecutor",
        joinColumns = [JoinColumn(name = "idAssessment")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var taskExecutors: MutableSet<User> = mutableSetOf(),

    @ManyToMany
    @JoinTable(
        name = "AssessmentTaskEvaluator",
        joinColumns = [JoinColumn(name = "idAssessment")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var taskEvaluators: MutableSet<User> = mutableSetOf(),

    @Column(nullable = false)
    var assessmentDate: Date = Date(),

    @Column(nullable = false)
    var parameter0Result: Boolean? = null,

    @Column(nullable = false)
    var parameter1Result: Boolean? = null,

    @Column(nullable = false)
    var parameter2Result: Boolean? = null,

    @Column(nullable = true)
    var parameter3Result: Boolean? = null,

    @Column(nullable = true)
    var parameter4Result: Boolean? = null,

    @Column(nullable = true)
    var parameter5Result: Boolean? = null,

    @Column(nullable = true)
    var parameter6Result: Boolean? = null,

    @Column(nullable = true)
    var parameter7Result: Boolean? = null,

    @Column(nullable = true)
    var parameter8Result: Boolean? = null,

    @Column(nullable = true)
    var parameter9Result: Boolean? = null,

    @Column(nullable = false)
    var assessmentResult: Boolean = false,

    @Column
    var obs: String? = null,

    @Column
    @Lob
    var assessmentPhoto0: String? = null,

    @Column
    @Lob
    var assessmentPhoto1: String? = null,

    @Column
    @Lob
    var assessmentPhoto2: String? = null,

    @Column
    @Lob
    var assessmentPhoto3: String? = null,

    @Column
    @Lob
    var assessmentPhoto4: String? = null,

    @Column
    @Lob
    var assessmentPhoto5: String? = null,

    @Column(nullable = false)
    var isReassessment: Boolean = false

)