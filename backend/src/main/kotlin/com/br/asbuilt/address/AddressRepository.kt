package com.br.asbuilt.address

import com.br.asbuilt.builder.Builder
import com.br.asbuilt.costCenters.CostCenter
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface AddressRepository : JpaRepository<Address, Long>{

    @Query("SELECT a FROM Address a " +
            "WHERE a.street = :street AND a.number = :number AND a.city = :city " +
            "AND a.state = :state AND a.postalCode = :postalCode")
    fun findFullAddress(
        street: String?,
        number: Int?,
        city: String?,
        state: String?,
        postalCode: String?
    ): Address?

    @Query("SELECT b FROM Builder b " +
            "INNER JOIN b.builderAddress a " +
            "WHERE a.street = :street AND a.number = :number AND a.city = :city " +
            "AND a.state = :state AND a.postalCode = :postalCode")
    fun findBuilderByFullAddress(
        street: String?,
        number: Int?,
        city: String?,
        state: String?,
        postalCode: String?
    ): Builder?

    @Query("SELECT c FROM CostCenter c " +
            "INNER JOIN c.costCenterAddress ca " +
            "WHERE ca.street = :street AND ca.number = :number AND ca.city = :city " +
            "AND ca.state = :state AND ca.postalCode = :postalCode")
    fun findCostCenterByFullAddress(
        street: String?,
        number: Int?,
        city: String?,
        state: String?,
        postalCode: String?
    ): CostCenter?

}