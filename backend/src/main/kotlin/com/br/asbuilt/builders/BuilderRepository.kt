package com.br.asbuilt.builders

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface BuilderRepository : JpaRepository<Builder, Long>{

    @Query("select distinct b from Builder b where b.builderName = :builderName")
    fun findBuilderByName(builderName: String): Builder?

    @Query("select distinct b from Builder b where b.cnpj = :cnpj")
    fun findByCnpj(cnpj: String): Builder?

}