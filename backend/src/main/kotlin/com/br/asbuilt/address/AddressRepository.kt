package com.br.asbuilt.address

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

}