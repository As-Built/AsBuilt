package com.br.asbuilt.productionValue

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductionValueRepository : JpaRepository<ProductionValue, Long> {

}