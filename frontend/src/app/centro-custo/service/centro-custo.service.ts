import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CentroCustoModel } from '../model/centro-custo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentroCustoService {
  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.token}`    
    }),
    withCredentials: false
  };
  
  listarCentrosDeCusto(): Observable<CentroCustoModel[]> {
    return this.httpClient.get<CentroCustoModel[]>('http://localhost:8080/asbuilt/costCenter', this.httpOptions);
  }

  listarCentrosDeCustoPorConstrutora(id: number): Observable<CentroCustoModel[]> {
    return this.httpClient.get<CentroCustoModel[]>(`http://localhost:8080/asbuilt/costCenter/getCostCenterByBuilder/${id}`, this.httpOptions);
  }

  cadastrarCentroDeCusto(cadastroModel: CentroCustoModel) {

    let body = JSON.stringify({
      costCenterName: cadastroModel.costCenterName,
      costCenterAddress: {
        street: cadastroModel.costCenterAddress.street,
        number: cadastroModel.costCenterAddress.number,
        city: cadastroModel.costCenterAddress.city,
        state: cadastroModel.costCenterAddress.state,
        postalCode: cadastroModel.costCenterAddress.postalCode
      },
      valueUndertaken: cadastroModel.valueUndertaken,
      expectedBudget: cadastroModel.expectedBudget,
      builder: cadastroModel.builder,
    });

    return this.httpClient.
      post<CentroCustoModel>('http://localhost:8080/asbuilt/costCenter/insertCostCenter', body, this.httpOptions);
  }

  atualizarDadosCentroDeCusto(centro: CentroCustoModel) {
    let body = JSON.stringify({
      id: centro.id,
      costCenterName: centro.costCenterName,
      costCenterAddress: {
        id: centro.costCenterAddress.id,
        street: centro.costCenterAddress.street,
        number: centro.costCenterAddress.number,
        city: centro.costCenterAddress.city,
        state: centro.costCenterAddress.state,
        postalCode: centro.costCenterAddress.postalCode
      },
      valueUndertaken: centro.valueUndertaken,
      expectedBudget: centro.expectedBudget,
      builder: {
        id: centro.builder.id,
        builderName: centro.builder.builderName,
        cnpj: centro.builder.cnpj,
        phone: centro.builder.phone,
        builderAddress: {
          id: centro.builder.builderAddress.id,
          street: centro.builder.builderAddress.street,
          number: centro.builder.builderAddress.number,
          city: centro.builder.builderAddress.city,
          state: centro.builder.builderAddress.state,
          postalCode: centro.builder.builderAddress.postalCode
        }
      },
    });
    return this.httpClient.
      patch<CentroCustoModel>('http://localhost:8080/asbuilt/costCenter/updateCostCenter', body, this.httpOptions);
  }

  excluirCentroDeCusto(id: number) {
    return this.httpClient.
      delete(`http://localhost:8080/asbuilt/costCenter/deleteCostCenter/${id}`, this.httpOptions);
  }

}



