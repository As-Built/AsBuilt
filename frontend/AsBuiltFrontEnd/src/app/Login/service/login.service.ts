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
        'Content-Type':  'application/json'       
      }),
      withCredentials: false
    };

    let email = autenticacao.email;
    let password = autenticacao.password;
    let body = JSON.stringify({email, password});

    return this.httpClient.
      post<any>('http://localhost:8080/api/users/login', body, httpOptions);
  }
}