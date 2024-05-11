import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroServicoModel } from '../model/cadastro-servico.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class CadastroServicoService {

  constructor(private httpClient: HttpClient) { }

  cadastrarServico(cadastroModel: CadastroServicoModel) {

    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`    
      }),
      withCredentials: false
    };

    let body = JSON.stringify({
      taskType: cadastroModel.taskType,
      unitaryValue: cadastroModel.unitaryValue,
      dimension: cadastroModel.dimension,
      unitMeasurement: cadastroModel.unitMeasurement,
      costCenterId: cadastroModel.costCenterId,
      placeOfExecution: cadastroModel.placeOfExecution,
      startDate: cadastroModel.startDate,
      expectedEndDate: cadastroModel.expectedEndDate,
      finalDate: cadastroModel.finalDate,
      amount: cadastroModel.amount,
      obs: cadastroModel.obs
    });


    return this.httpClient.
      post<any>('http://localhost:8080/asbuilt/tasks/insertTask', body, httpOptions);
  }
}