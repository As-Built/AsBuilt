import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RolesModel } from '../model/roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }),
    withCredentials: false
  };

  listarRoles() {
    return this.httpClient.get<RolesModel[]>('http://localhost:8080/asbuilt/roles', this.httpOptions);
  }

  adicionarRole(usuarioId: number, role: string) {
    return this.httpClient.post(`http://localhost:8080/asbuilt/users/grantRole/${usuarioId}/${role}`, this.httpOptions);
  }
  
}
