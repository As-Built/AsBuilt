package com.br.asbuilt.tasks.controller.requests

import com.br.asbuilt.tasks.Task
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.util.*

data class CreateOrUpdateTaskRequest(
    @field:NotBlank
    val tipoServico: String,

    @field:NotNull
    val valorUnitario: Double,

    @field:NotNull
    val dimensao: Double,

    @field:NotBlank
    val unidadeMedida: String,

    @field:NotNull
    val centroDeCustoId: Long,

    @field:NotBlank
    val localExecucao: String,

    @field:NotNull
    val dataInicio: Date,

    @field:NotNull
    val previsaoTermino: Date,

    val dataFinal: Date?,

    val obs: String?,

    val executor: Set<Long>?,

    val conferente: Set<Long>?,

    ){
    fun toTask() = Task (
        tipoServico = tipoServico,
        valorUnitario = valorUnitario,
        dimensao = dimensao,
        unidadeMedida = unidadeMedida,
        localExecucao = localExecucao,
        dataInicio = dataInicio,
        previsaoTermino = previsaoTermino,
        dataFinal = dataFinal,
        valorTotal = valorUnitario * dimensao,
        obs = obs
    )
}