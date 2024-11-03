package com.br.asbuilt.salary

import com.br.asbuilt.users.User
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name = "TblSalary")
class Salary (
    @Id
    @GeneratedValue
    var id: Long? = null,

    @Column(nullable = false)
    var value: Double = 0.0,

    @Column(nullable = false)
    var updateDate: Date = Date(),

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    var user: User?,
){}