import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstrutoraModel } from '../model/construtora.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstrutoraService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }),
    withCredentials: false
  };

  listarConstrutoras(): Observable<ConstrutoraModel[]> {
    return this.httpClient.get<ConstrutoraModel[]>('http://localhost:8080/asbuilt/builder', this.httpOptions);
  }

  cadastrarConstrutora(construtoraModel: ConstrutoraModel) {

    let body = JSON.stringify({
      builderName: construtoraModel.builderName,
      cnpj: construtoraModel.cnpj,
      phone: construtoraModel.phone,
      builderAddress: {
        street: construtoraModel.builderAddress.street,
        number: construtoraModel.builderAddress.number,
        city: construtoraModel.builderAddress.city,
        state: construtoraModel.builderAddress.state,
        postalCode: construtoraModel.builderAddress.postalCode
      },
    });
    return this.httpClient.
      post<ConstrutoraModel>('http://localhost:8080/asbuilt/builder/insertBuilder', body, this.httpOptions);
  }
}
