import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticacao } from '../model/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  signIn(autenticacao: Autenticacao) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'       
      }),
      withCredentials: false
    };

    let body = JSON.stringify({
      email: autenticacao.email, 
      password: autenticacao.password
    });

    return this.httpClient.
      post<any>('http://localhost:8080/asbuilt/users/login', body, httpOptions);
  }

  recuperarSenha(email: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'       
      }),
      withCredentials: false
    };

    let body = JSON.stringify({
      email: email
    });
    const url = `http://localhost:8080/asbuilt/users/recuperarSenha/${email}`
    return this.httpClient.post<any>(url, httpOptions);
  }
}