import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class PerfilUsuarioComponent implements OnInit {

  @ViewChild('userImage') userImage!: ElementRef;

  perfilUsuario = new PerfilUsuarioModel();
  estadosBrasileiros = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  fileToUpload: File | null = null;
  fileIsLoading = false;
  isFileValid = false;
  profilePicture: string | null = null;
  profilePictureBlob: Uint8Array = new Uint8Array();

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
      let teste = await lastValueFrom(this.perfilUsuarioService.buscarPerfilUsuario(Number(usuarioId)));
      this.perfilUsuario = teste;
      this.fetchImage(this.perfilUsuario.photo);
    } catch (error) {
      console.error(error)
    }
  }

  handleFileInput(target: EventTarget | null) {
    if (!target) {
      return;
    }

    const files = (target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files.item(0);
    if (!file) {
      return;
    }
  
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      Swal.fire({
        text: "Por favor, selecione uma imagem em formato .png ou .jpg",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
      this.isFileValid = false;
      return;
    } else {
      this.isFileValid = true;
    }

    if (this.isFileValid) {
      this.fileToUpload = file;

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
        this.profilePictureBlob = new Uint8Array(byteArray.buffer);
        this.fileIsLoading = false;
      }
      reader.readAsArrayBuffer(this.fileToUpload);
      this.profilePicture = URL.createObjectURL(this.fileToUpload);
    }
  }

  updatePerfilUsuarioFoto() {
    this.perfilUsuarioService.updateProfilePicture(this.profilePictureBlob).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Foto de perfil atualizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.isFileValid = false;
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
    if (blobNameWithoutExtension === "" || blobNameWithoutExtension === null) {
      this.profilePicture = "assets/EmptyProfilePicture.png"; // Imagem padrão
    } else {
      this.perfilUsuarioService.downloadProfilePicture(blobNameWithoutExtension)
      .subscribe(blob => {
        this.profilePicture = URL.createObjectURL(blob);
      });
    }
  }

  triggerFileInput() {
    this.userImage.nativeElement.click();
  }

}
