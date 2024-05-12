import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CentroCustoModel } from '../model/centro-custo.model';

@Injectable({
  providedIn: 'root'
})
export class CentroCustoService {
  constructor(private httpClient: HttpClient) { }

  cadastrarCentroDeCusto(cadastroModel: CentroCustoModel) {
    const token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`    
      }),
      withCredentials: false
    };

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
      post<CentroCustoModel>('http://localhost:8080/asbuilt/costCenter/insertCostCenter', body, httpOptions);
  }
}



