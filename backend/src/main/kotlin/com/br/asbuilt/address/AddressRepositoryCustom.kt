package com.br.asbuilt.address

import com.microsoft.sqlserver.jdbc.SQLServerException
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.SqlParameterSource
import org.springframework.stereotype.Repository

@Repository
class AddressRepositoryCustom(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate
) {
    fun validateAndUpdateEntityAddress(
        street: String?,
        number: Int?,
        city: String?,
        state: String?,
        postalCode: String?,
        entityId: Long?,
        entityTable: String,
        entityAddressColumn: String,
        entityIdColumn: String  // Novo parâmetro para a coluna de ID
    ) {
        val sql = "{call sp_ValidateAndUpdateEntityAddress(:Street, :Number, :City, :State, :PostalCode, :EntityId, :EntityTable, :EntityAddressColumn, :EntityIdColumn)}"

        val params: SqlParameterSource = MapSqlParameterSource()
            .addValue("Street", street)
            .addValue("Number", number)
            .addValue("City", city)
            .addValue("State", state)
            .addValue("PostalCode", postalCode)
            .addValue("EntityId", entityId)
            .addValue("EntityTable", entityTable)
            .addValue("EntityAddressColumn", entityAddressColumn)
            .addValue("EntityIdColumn", entityIdColumn)

        try {
            namedParameterJdbcTemplate.execute(sql, params) { callableStatement ->
                callableStatement.execute()
            }
        } catch (ex: Exception) {
            val errorMessage = when (ex) {
                is SQLServerException -> {
                    if (ex.message?.contains("Another entity with the same address already exists") == true) {
                        "Já existe outra entidade com o mesmo endereço. Verifique o endereço e tente novamente."
                    } else {
                        "Erro de banco de dados inesperado: ${ex.message}"
                    }
                }
                else -> "Erro ao atualizar o endereço: ${ex.message}"
            }
            throw RuntimeException(errorMessage, ex)
        }
    }
}

