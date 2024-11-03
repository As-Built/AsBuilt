package com.br.asbuilt.salary

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class SalaryService (
    salaryRepositoy: SalaryRepositoy
) {


    companion object {
        private val log = LoggerFactory.getLogger(SalaryService::class.java)
    }
}