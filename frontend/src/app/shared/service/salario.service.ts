import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalarioModel } from '../model/salario.model';

@Injectable({
  providedIn: 'root'
})
export class SalarioService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }),
    withCredentials: false
  };

  inserirSalario(salario: SalarioModel) {
    let body = {
      value: salario.value,
      updateDate: salario.updateDate,
      user: salario.user
    };
    return this.httpClient.post<SalarioModel>('http://localhost:8080/asbuilt/salary/insertSalary', body, this.httpOptions);
  }

  buscarSomaUltimosSalarios() {
    return this.httpClient.get<number>('http://localhost:8080/asbuilt/salary/sumLatestSalaries', this.httpOptions);
  }
}
