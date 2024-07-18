import { Component, OnInit } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { PerfilUsuarioService } from './service/perfil-usuario.service';
import { PerfilUsuarioModel } from './model/perfil-usuario.model';
import { catchError, firstValueFrom, lastValueFrom, of, tap } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss']
})
export class PerfilUsuarioComponent implements OnInit{

  perfilUsuario = new PerfilUsuarioModel();
  estadosBrasileiros = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  constructor(private perfilUsuarioService: PerfilUsuarioService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.buscarPerfilUsuario();
  }

  getUserId(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return "";
    }
  
    const decodedToken = jwtDecode(token) as any;
    const userId = decodedToken.user.id;
    return userId;
  }

  async buscarPerfilUsuario() {
    try {
      const usuarioId = this.getUserId();
      this.perfilUsuario = await firstValueFrom(this.perfilUsuarioService.buscarPerfilUsuario(Number(usuarioId)));
    } catch (error) {
      console.error(error)
    }
  }

  updatePerfilUsuario() {
    this.perfilUsuarioService.updatePerfilUsuario(this.perfilUsuario).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Atualização realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.buscarPerfilUsuario();
      }),
      catchError(error => {
        Swal.fire({
          text: error.error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
        return of();
      })
    ).subscribe();
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
