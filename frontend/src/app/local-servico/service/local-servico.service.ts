import { Injectable } from '@angular/core';
import { LocalServicoModel } from '../model/local-servico.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalServicoService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }),
    withCredentials: false
  };

  listarLocais(): Observable<LocalServicoModel[]> {
    return this.httpClient.get<LocalServicoModel[]>('http://localhost:8080/asbuilt/location', this.httpOptions);
  }

  listarLocaisPorCentroDeCusto(id: number): Observable<LocalServicoModel[]> {
    return this.httpClient.get<LocalServicoModel[]>(`http://localhost:8080/asbuilt/location/findLocationByCostCenter/${id}`, this.httpOptions);
  }

  cadastrarLocal(localServico: LocalServicoModel) {
    let body = JSON.stringify({
      costCenter: localServico.costCenter,
      locationGroup: localServico.locationGroup,
      subGroup1: localServico.subGroup1,
      subGroup2: localServico.subGroup2,
      subGroup3: localServico.subGroup3,
    });
    return this.httpClient.
      post<LocalServicoModel>('http://localhost:8080/asbuilt/location/insertLocation', body, this.httpOptions);
  }

  atualizarLocal(localServico: LocalServicoModel) {
    let body = JSON.stringify({
      id: localServico.id,
      costCenter: localServico.costCenter,
      locationGroup: localServico.locationGroup,
      subGroup1: localServico.subGroup1,
      subGroup2: localServico.subGroup2,
      subGroup3: localServico.subGroup3,
    });
    return this.httpClient.
      patch<LocalServicoModel>('http://localhost:8080/asbuilt/location/updateLocation', body, this.httpOptions);
  }

  excluirLocal(id: number) {
    return this.httpClient.delete(`http://localhost:8080/asbuilt/location/deleteLocation/${id}`, this.httpOptions);
  }
}

