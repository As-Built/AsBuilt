import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServicoModel } from '../model/servico.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.token}`    
    }),
    withCredentials: false
  };

  listarServicos(): Observable<ServicoModel[]> {
    return this.httpClient.get<ServicoModel[]>('http://localhost:8080/asbuilt/tasks/listTasks', this.httpOptions);
  }

  cadastrarServico(cadastroModel: ServicoModel) {

    let body = JSON.stringify({
      taskType: cadastroModel.taskType,
      unitaryValue: cadastroModel.unitaryValue,
      dimension: cadastroModel.dimension,
      unitMeasurement: cadastroModel.unitMeasurement,
      costCenter: cadastroModel.costCenter,
      taskLocation: cadastroModel.taskLocation,
      expectedStartDate: cadastroModel.expectedStartDate,
      startDate: cadastroModel.startDate,
      expectedEndDate: cadastroModel.expectedEndDate,
      finalDate: cadastroModel.finalDate,
      amount: cadastroModel.amount,
      obs: cadastroModel.obs,
      executor: cadastroModel.executors,
      evaluators: cadastroModel.evaluators
    });

    return this.httpClient.
      post<ServicoModel>('http://localhost:8080/asbuilt/tasks/insertTask', body, this.httpOptions);
  }

  atualizarServico(servico: ServicoModel) {
    let body = JSON.stringify({
      id: servico.id,
      taskType: servico.taskType,
      unitaryValue: servico.unitaryValue,
      dimension: servico.dimension,
      unitMeasurement: servico.unitMeasurement,
      costCenter: servico.costCenter,
      taskLocation: servico.taskLocation,
      expectedStartDate: servico.expectedStartDate,
      startDate: servico.startDate,
      expectedEndDate: servico.expectedEndDate,
      finalDate: servico.finalDate,
      amount: servico.amount,
      obs: servico.obs,
      executors: servico.executors,
      evaluators: servico.evaluators
    });
    return this.httpClient.
      patch<ServicoModel>('http://localhost:8080/asbuilt/tasks/updateTask', body, this.httpOptions);
  }

  excluirServico(id: number) {
    return this.httpClient.delete(`http://localhost:8080/asbuilt/tasks/deleteTask/${id}`, this.httpOptions);
  }

  enviarArquivo(file: File): Promise<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
  
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });
  
    return this.httpClient.post<number>('http://localhost:8080/asbuilt/tasks/insertBatchTasks', formData, { headers }).toPromise().then(response => {
      if (typeof response === 'number') {
        return response;
      } else {
        throw new Error('A resposta do servidor não é um número');
      }
    }).catch(error => {
      console.error('Erro ao enviar arquivo', error);
      throw error;
    });
  }
}