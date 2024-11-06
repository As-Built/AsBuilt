import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValorProducaoModel } from '../model/valor-producao.model';

@Injectable({
  providedIn: 'root'
})
export class ValorProducaoService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.token}`    
    }),
    withCredentials: false
  };

  inserirValorProducao(valorProducao: ValorProducaoModel) {
    let body = JSON.stringify({
      value: valorProducao.value,
      date: valorProducao.date,
      user: valorProducao.user,
      task: valorProducao.task,
      assessment: valorProducao.assessment,
      assessmentPercentage: valorProducao.assessmentPercentage
    });
  
    return this.httpClient.post<ValorProducaoModel>('http://localhost:8080/asbuilt/productionValue/insertProductionValue', body, this.httpOptions);
  }

  buscarValorProducaoPorAvaliacao(avaliacaoId: number) {
    return this.httpClient.get<ValorProducaoModel[]>(`http://localhost:8080/asbuilt/productionValue/getProductionValueByAssessmentId/${avaliacaoId}`, this.httpOptions);
  }

  buscarValorProducaoPorMesPorUsuario(mes: number, userId: number) {
    return this.httpClient.get<ValorProducaoModel[]>(`http://localhost:8080/asbuilt/productionValue/getProductionValueByMonthAndUserId/${mes}/${userId}`, this.httpOptions);
  }

  buscarValorProducaoTotalPorUsuario(userId: number) {
    return this.httpClient.get<ValorProducaoModel[]>(`http://localhost:8080/asbuilt/productionValue/getProductionValueByUserId/${userId}`, this.httpOptions);
  }

  buscarValorProducaoTotal() {
    return this.httpClient.get<ValorProducaoModel[]>('http://localhost:8080/asbuilt/productionValue/getProductionValue', this.httpOptions);
  }

  buscarValorProducaoTotalPorMes(mes: number) {
    return this.httpClient.get<ValorProducaoModel[]>(`http://localhost:8080/asbuilt/productionValue/getProductionValueByMonth/${mes}`, this.httpOptions);
  }

  buscarValorProducaoPorPeriodo(dataInicio: Date, dataFim: Date) {
    return this.httpClient.get<ValorProducaoModel[]>(`http://localhost:8080/asbuilt/productionValue/getProductionValueByPeriod/${dataInicio}/${dataFim}`, this.httpOptions);
  }

  buscarValorProducaoPorPeriodoEUsuarioId(dataInicio: Date, dataFim: Date, usuarioId: number) {
    return this.httpClient.get<ValorProducaoModel[]>(`http://localhost:8080/asbuilt/productionValue/getProductionValueByPeriodAndUserId/${dataInicio}/${dataFim}/${usuarioId}`, this.httpOptions);
  }

}
