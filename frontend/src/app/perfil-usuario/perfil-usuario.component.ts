import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class PerfilUsuarioComponent implements OnInit, AfterViewInit{

  perfilUsuario = new PerfilUsuarioModel();
  estadosBrasileiros = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  fileToUpload: File | null = null;
  imageUrl: string | null = null;

  constructor(private perfilUsuarioService: PerfilUsuarioService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.buscarPerfilUsuario();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fetchImage('1539fc35-f00a-44f0-8b92-4df16b0478c3');
    }, 0);
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

  fileIsLoading = false;

  handleFileInput(target: EventTarget | null) {
    if (!target) {
        return;
    }
    const files = (target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }
    this.fileToUpload = files.item(0);
    if (!this.fileToUpload) {
      return;
    }
    const reader = new FileReader();
    this.fileIsLoading = true;
    reader.onload = (event: any) => {
      const byteArray = new Uint8Array(event.target.result);
      let base64String = '';
      const chunkSize = 5000; // Tamanho do pedaço
      for (let i = 0; i < byteArray.length; i += chunkSize) {
        const chunk = byteArray.slice(i, i + chunkSize);
        base64String += btoa(String.fromCharCode(...chunk));
      }
        this.perfilUsuario.photo = new Uint8Array(byteArray.buffer);
        this.fileIsLoading = false;
    }
    reader.readAsArrayBuffer(this.fileToUpload);
  }
  
  updatePerfilUsuarioFoto(){
    this.perfilUsuarioService.updatePerfilUsuarioFoto(this.perfilUsuario.photo).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Foto de perfil atualizada com sucesso!",
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

fetchImage(blobNameWithoutExtension: string): void {
  this.perfilUsuarioService.downloadBlobFile(blobNameWithoutExtension)
    .subscribe(blob => {
      this.imageUrl = URL.createObjectURL(blob);
    });
}

}
