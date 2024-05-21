import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoServicoModel } from '../model/tipo-servico.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposServicoService {
  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }),
    withCredentials: false
  };

  listarTiposDeServico(): Observable<TipoServicoModel[]> {
    return this.httpClient.get<TipoServicoModel[]>('http://localhost:8080/asbuilt/taskType', this.httpOptions);
  }

  cadastrarTipoDeServico(tipoDeServico: TipoServicoModel) {
    let body = JSON.stringify({
      taskTypeName: tipoDeServico.taskTypeName,
      taskTypeDescription: tipoDeServico.taskTypeDescription,
      unitMeasurement: tipoDeServico.unitMeasurement,
      parameter0Name: tipoDeServico.parameter0Name,
      parameter1Name: tipoDeServico.parameter1Name,
      parameter2Name: tipoDeServico.parameter2Name,
      parameter3Name: tipoDeServico.parameter3Name,
      parameter4Name: tipoDeServico.parameter4Name,
      parameter5Name: tipoDeServico.parameter5Name,
      parameter6Name: tipoDeServico.parameter6Name,
      parameter7Name: tipoDeServico.parameter7Name,
      parameter8Name: tipoDeServico.parameter8Name,
      parameter9Name: tipoDeServico.parameter9Name,
      comments: tipoDeServico.comments
    });
    return this.httpClient.
      post<TipoServicoModel>('http://localhost:8080/asbuilt/taskType/insertTaskType', body, this.httpOptions);
  }

  atualizarTipoDeServico(tipoDeServico: TipoServicoModel) {
    let body = JSON.stringify({
      id: tipoDeServico.id,
      taskTypeName: tipoDeServico.taskTypeName,
      taskTypeDescription: tipoDeServico.taskTypeDescription,
      unitMeasurement: tipoDeServico.unitMeasurement,
      parameter0Name: tipoDeServico.parameter0Name,
      parameter1Name: tipoDeServico.parameter1Name,
      parameter2Name: tipoDeServico.parameter2Name,
      parameter3Name: tipoDeServico.parameter3Name,
      parameter4Name: tipoDeServico.parameter4Name,
      parameter5Name: tipoDeServico.parameter5Name,
      parameter6Name: tipoDeServico.parameter6Name,
      parameter7Name: tipoDeServico.parameter7Name,
      parameter8Name: tipoDeServico.parameter8Name,
      parameter9Name: tipoDeServico.parameter9Name,
      comments: tipoDeServico.comments
    });
    return this.httpClient.
      patch<TipoServicoModel>('http://localhost:8080/asbuilt/taskType/updateTaskType', body, this.httpOptions);
  }

  excluirTipoDeServico(id: number) {
    return this.httpClient.delete(`http://localhost:8080/asbuilt/taskType/deleteTaskType/${id}`, this.httpOptions);
  }
}