package com.br.asbuilt.assessment

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AssessmentRepository : JpaRepository <Assessment, Long> {

}