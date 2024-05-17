package com.br.asbuilt.locations

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
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
            "WHERE l.costCenter.id = :costCenterId " +
            "AND l.locationGroup = :locationGroup " +
            "AND (:subGroup1 IS NULL OR l.subGroup1 = :subGroup1) " +
            "AND (:subGroup2 IS NULL OR l.subGroup2 = :subGroup2) " +
            "AND (:subGroup3 IS NULL OR l.subGroup3 = :subGroup3)")
    fun findSameLocation(@Param("costCenterId") costCenterId: Long,
                         @Param("locationGroup") locationGroup: String,
                         @Param("subGroup1") subGroup1: String?,
                         @Param("subGroup2") subGroup2: String?,
                         @Param("subGroup3") subGroup3: String?): Location?
}