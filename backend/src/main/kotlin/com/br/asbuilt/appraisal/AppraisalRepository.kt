package com.br.asbuilt.appraisal

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AppraisalRepository : JpaRepository <Appraisal, Long> {

}