package com.br.asbuilt.locations

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface LocationRepository : JpaRepository<Location, Long> {
    @Query("SELECT l FROM Location l WHERE l.locationGroup = :group")
    fun findLocationByGroup(group: String): List<Location>

    @Query("SELECT l FROM Location l WHERE l.subGroup1 = :subGroup1")
    fun findLocationBySubGroup1(subGroup1: String): List<Location>

    @Query("SELECT l FROM Location l WHERE l.subGroup2 = :subGroup2")
    fun findLocationBySubGroup2(subGroup2: String): List<Location>

    @Query("SELECT l FROM Location l WHERE l.subGroup3 = :subGroup3")
    fun findLocationBySubGroup3(subGroup3: String): List<Location>

    @Query("SELECT l FROM Location l " +
            "WHERE l.locationGroup = :locationGroup AND l.subGroup1 = :subGroup1 " +
            "AND l.subGroup2 = :subGroup2 AND l.subGroup3 = :subGroup3")
    fun compareLocation(locationGroup: String, subGroup1: String, subGroup2: String, subGroup3: String): Location?
}