import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticacao } from '../model/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(autenticacao: Autenticacao) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'       
      }),
      withCredentials: true // Add this line to include credentials in the request
    };

    let login = autenticacao.login;
    let senha = autenticacao.senha;
    let body = `login=${login}&senha=${senha}`;

    return this.httpClient.
      post<any>('http://localhost:8080/api/asbuilt/users/login', body, httpOptions);
  }
}