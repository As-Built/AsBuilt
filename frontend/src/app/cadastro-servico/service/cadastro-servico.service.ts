import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroServicoModel } from '../model/cadastro-servico.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class CadastroServicoService {

  constructor(private httpClient: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'       
    }),
    withCredentials: false
  };

  CadastrarServico(cadastroModel: CadastroServicoModel) {

    let body = JSON.stringify({
      tipoServico: cadastroModel.tipoServico,
      valorUnitario: cadastroModel.valorUnitario,
      dimensao: cadastroModel.dimensao,
      unidadeMedida: cadastroModel.unidadeMedida,
      localExecucao: cadastroModel.localExecucao,
      dataInicio: cadastroModel.dataInicio,
      previsaoTermino: cadastroModel.previsaoTermino,
      dataFinal: cadastroModel.dataFinal,
      valorTotal: cadastroModel.valorTotal,
      obs: cadastroModel.obs
    });

    return this.httpClient.
      post<CadastroServicoModel>('http://localhost:8080/asbuilt/insertTask', body, this.httpOptions);
  }
}