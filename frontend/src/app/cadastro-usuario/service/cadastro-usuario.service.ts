import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroUsuarioModel } from '../model/cadastro-usuario.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class CadastroUsuarioService {

  constructor(private httpClient: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'       
    }),
    withCredentials: false
  };

  verificarEmailJaCadastrado(email: string) {
    return this.httpClient.get<CadastroUsuarioModel>('http://localhost:8080/asbuilt/users/findByEmail/' + email, this.httpOptions);
  }

    verificarCpfJaCadastrado(cpf: string) {
    return this.httpClient.get<CadastroUsuarioModel>('http://localhost:8080/asbuilt/users/findByCpf/' + cpf, this.httpOptions);
  }

  signUp(cadastroModel: CadastroUsuarioModel) {

    let body = JSON.stringify({
      cpf: cadastroModel.cpf,
      name: cadastroModel.name,
      email: cadastroModel.email,
      password: cadastroModel.password
    });

    return this.httpClient.
      post<CadastroUsuarioModel>('http://localhost:8080/asbuilt/users', body, this.httpOptions);
  }
}