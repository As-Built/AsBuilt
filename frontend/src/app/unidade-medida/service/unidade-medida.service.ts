import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnidadeMedidaModel } from '../../shared/model/unidade-medida.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadeMedidaService {
  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }),
    withCredentials: false
  };

  listarUnidadesDeMedida(): Observable<UnidadeMedidaModel[]> {
    return this.httpClient.get<UnidadeMedidaModel[]>('http://localhost:8080/asbuilt/unitMeasurement', this.httpOptions);
  }

  cadastrarUnidadesDeMedida(unidadeDeMedida: UnidadeMedidaModel) {
    let body = JSON.stringify({
      name: unidadeDeMedida.name,
      description: unidadeDeMedida.description
    });
    return this.httpClient.
      post<UnidadeMedidaModel>('http://localhost:8080/asbuilt/unitMeasurement/insertUnitMeasurement', body, this.httpOptions);
  }
}