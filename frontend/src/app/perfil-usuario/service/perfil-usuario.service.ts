import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PerfilUsuarioModel } from '../model/perfil-usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.token}`    
    }),
    withCredentials: false
  };

  buscarPerfilUsuario(id: number): Observable<PerfilUsuarioModel> {
    return this.httpClient.get<PerfilUsuarioModel>(`http://localhost:8080/asbuilt/users/${id}`, this.httpOptions);

  }
  updatePerfilUsuarioFoto(photo: Uint8Array): Observable<any> {
    let formData = new FormData();
    formData.append('blobName', '8fbe0f8d-5a1e-42eb-9336-aed3d14037d3.jpg');
    formData.append('data', new Blob([photo.buffer]));
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  
    return this.httpClient.post("http://localhost:8080/asbuilt/blob/writeBlobFile", formData, { headers });
  }

  updatePerfilUsuario(perfilUsuario: PerfilUsuarioModel): Observable<PerfilUsuarioModel> {
    let body = JSON.stringify({
      id: perfilUsuario.id,
      name: perfilUsuario.name,
      email: perfilUsuario.email,
      cpf: perfilUsuario.cpf,
      phone: perfilUsuario.phone,
      // photo: perfilUsuario.photo,
      userAddress: {
        id: perfilUsuario.userAddress.id,
        street: perfilUsuario.userAddress.street,
        number: perfilUsuario.userAddress.number,
        city: perfilUsuario.userAddress.city,
        state: perfilUsuario.userAddress.state,
        postalCode: perfilUsuario.userAddress.postalCode
      },
    });
    return this.httpClient.patch<PerfilUsuarioModel>("http://localhost:8080/asbuilt/users/updateUser", body, this.httpOptions);
  }

}
