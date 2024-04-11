import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroServicoModel } from '../model/cadastro-servico.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class CadastroServicoService {

  constructor(private httpClient: HttpClient) { }

  CadastrarServico(cadastroModel: CadastroServicoModel) {

    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`    
      }),
      withCredentials: false
    };

    let body = JSON.stringify({
      tipoServico: cadastroModel.tipoServico,
      valorUnitario: cadastroModel.valorUnitario,
      dimensao: cadastroModel.dimensao,
      unidadeMedida: cadastroModel.unidadeMedida,
      centroDeCustoId: cadastroModel.centroDeCustoId,
      localExecucao: cadastroModel.localExecucao,
      dataInicio: cadastroModel.dataInicio,
      previsaoTermino: cadastroModel.previsaoTermino,
      dataFinal: cadastroModel.dataFinal,
      valorTotal: cadastroModel.valorTotal,
      obs: cadastroModel.obs
    });


    return this.httpClient.
      post<any>('http://localhost:8080/asbuilt/tasks/insertTask', body, httpOptions);
  }
}