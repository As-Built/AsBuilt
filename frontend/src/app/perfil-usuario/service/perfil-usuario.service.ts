import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PerfilUsuarioModel } from '../model/perfil-usuario.model';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  
  updateProfilePicture(photo: Uint8Array): Observable<any> {
    let token = localStorage.getItem('token');
    let helper = new JwtHelperService();
    let decodedToken = token ? helper.decodeToken(token) : null;
    let userId = decodedToken && decodedToken.user ? decodedToken.user.id : null;

    let formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('fileName', 'newProfilePicture.jpg');
    formData.append('data', new Blob([photo.buffer]));

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.httpClient.post("http://localhost:8080/asbuilt/blob/updateProfilePicture", formData, { headers });
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

  downloadProfilePicture(fileNameWithoutExtension: string): Observable<Blob> {
    const params = new HttpParams().set('fileName', fileNameWithoutExtension);
    return this.httpClient.get('http://localhost:8080/asbuilt/blob/downloadProfilePicture', { params, responseType: 'blob' });
  }
}
