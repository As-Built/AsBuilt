import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroCentroCustoModel } from '../model/cadastro-centro-custo.model';

@Injectable({
  providedIn: 'root'
})
export class CadastroCentroCustoService {
  constructor(private httpClient: HttpClient) { }

  cadastrarCentroDeCusto(cadastroModel: CadastroCentroCustoModel) {
    const token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`    
      }),
      withCredentials: false
    };

    let body = JSON.stringify({
      nomeCentroDeCusto: cadastroModel.nomeCentroDeCusto,
      enderecoCentroDeCusto: {
        street: cadastroModel.enderecoCentroDeCusto.street,
        number: cadastroModel.enderecoCentroDeCusto.number,
        city: cadastroModel.enderecoCentroDeCusto.city,
        state: cadastroModel.enderecoCentroDeCusto.state,
        postalCode: cadastroModel.enderecoCentroDeCusto.postalCode
      },
      valorEmpreendido: cadastroModel.valorEmpreendido,
    });

    return this.httpClient.
      post<CadastroCentroCustoModel>('http://localhost:8080/asbuilt/costCenter/insertCostCenter', body, httpOptions);
  }
}



