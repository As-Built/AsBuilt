import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';
import { PerfilUsuarioModel } from 'src/app/perfil-usuario/model/perfil-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.token}`    
    }),
    withCredentials: false
  };

  listarUsuariosPorRole(role: string): Observable<UsuarioModel[]> {
    return this.httpClient.get<UsuarioModel[]>(`http://localhost:8080/asbuilt/users?role=${role}`, this.httpOptions);
  }

  listarUsuarios(): Observable<UsuarioModel[]> {
    return this.httpClient.get<UsuarioModel[]>('http://localhost:8080/asbuilt/users', this.httpOptions);
  }

  buscarUsuarioPorId(id: number): Observable<UsuarioModel> {
    return this.httpClient.get<UsuarioModel>(`http://localhost:8080/asbuilt/users/${id}`, this.httpOptions);
  }

  updateUsuario(perfilUsuario: PerfilUsuarioModel): Observable<PerfilUsuarioModel> {
    let body = JSON.stringify({
      id: perfilUsuario.id,
      name: perfilUsuario.name,
      email: perfilUsuario.email,
      cpf: perfilUsuario.cpf,
      phone: perfilUsuario.phone,
      photo: perfilUsuario.photo,
      userAddress: {
        id: perfilUsuario.userAddress.id,
        street: perfilUsuario.userAddress.street,
        number: perfilUsuario.userAddress.number,
        city: perfilUsuario.userAddress.city,
        state: perfilUsuario.userAddress.state,
        postalCode: perfilUsuario.userAddress.postalCode
      },
      salaries: perfilUsuario.salaries
    });
    return this.httpClient.patch<PerfilUsuarioModel>("http://localhost:8080/asbuilt/users/updateUser", body, this.httpOptions);
  }
  
}
