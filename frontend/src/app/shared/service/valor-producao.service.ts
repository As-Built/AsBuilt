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

  buscarValorProducaoPorMes(mes: number, userId: number) {
    return this.httpClient.get<ValorProducaoModel[]>(`http://localhost:8080/asbuilt/productionValue/getProductionValueByMonthAndUserId/${mes}/${userId}`, this.httpOptions);
  }

}
