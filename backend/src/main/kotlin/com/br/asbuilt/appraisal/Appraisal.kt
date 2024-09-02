package com.br.asbuilt.appraisal

import com.br.asbuilt.tasks.Task
import com.br.asbuilt.users.User
import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name = "TblAppraisal")
class Appraisal(

    @Id
    @GeneratedValue
    var id: Long? = null,

    @ManyToOne
    @JoinTable(
        name = "AppraisalTask",
        joinColumns = [JoinColumn(name = "idAppraisal")],
        inverseJoinColumns = [JoinColumn(name = "idTask")]
    )
    var task: Task?,

    @ManyToMany
    @JoinTable(
        name = "AppraisalTaskExecutor",
        joinColumns = [JoinColumn(name = "idAppraisal")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var taskExecutors: MutableList<User> = mutableListOf(),

    @ManyToOne
    @JoinTable(
        name = "AppraisalTaskLecturer",
        joinColumns = [JoinColumn(name = "idAppraisal")],
        inverseJoinColumns = [JoinColumn(name = "idUser")]
    )
    var taskLecturer: User,

    @Column(nullable = false)
    var appraisalDate: Date,

    @Column(nullable = false)
    var appraisalResult: Boolean? = null,

    @Column
    var obs: String? = null
)