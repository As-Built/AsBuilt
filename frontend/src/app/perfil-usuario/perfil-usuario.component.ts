import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { PerfilUsuarioService } from './service/perfil-usuario.service';
import { PerfilUsuarioModel } from './model/perfil-usuario.model';
import { catchError, firstValueFrom, lastValueFrom, of, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';


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
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
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
      this.spinner.show();
      const usuarioId = this.getUserId();
      let teste = await lastValueFrom(this.perfilUsuarioService.buscarPerfilUsuario(Number(usuarioId)));
      this.perfilUsuario = teste;
      this.fetchImage(this.perfilUsuario.photo);
      this.spinner.hide();
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
        text: this.translate.instant('USER_PROFILE.IMAGE_FORMAT_ERROR'),
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
    this.spinner.show();
    this.perfilUsuarioService.updateProfilePicture(this.profilePictureBlob).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('USER_PROFILE.PROFILE_PICTURE_UPDATED_SUCCESS'),
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.isFileValid = false;
        this.buscarPerfilUsuario();
      }),
      catchError(error => {
        this.spinner.hide();
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

  validaCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (
      !cpf ||
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    ) {
      return false
    }
    var soma = 0
    var resto
    for (var i = 0; i < 9; i++)
      soma = soma + parseInt(cpf.substring(i, i + 1)) * (10 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(9, 10))) return false
    soma = 0
    for (var i = 0; i < 10; i++)
      soma = soma + parseInt(cpf.substring(i, i + 1)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(10, 11))) return false
    return true
  }

  updatePerfilUsuario() {
    this.spinner.show();
    if (!this.validaCPF(this.perfilUsuario.cpf)) {
      this.spinner.hide();
      Swal.fire({
        text: this.translate.instant('USER_PROFILE.INVALID_CPF'),
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    } else {
      this.perfilUsuarioService.updatePerfilUsuario(this.perfilUsuario).pipe(
        tap(retorno => {
          this.spinner.hide();
          Swal.fire({
            text: this.translate.instant('USER_PROFILE.UPDATE_SUCCESS'),
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          });
          this.buscarPerfilUsuario();
        }),
        catchError(error => {
          this.spinner.hide();
          if (error.error === "A user with same CPF already exists") {
            this.translate.get('SIGNUP.USER_CPF_EXISTS').subscribe((translatedText: string) => {
              Swal.fire({
                text: translatedText,
                icon: "error",
                showConfirmButton: false,
                timer: 2000
              });
            });
          } else if (error.error === "A user with same EMAIL already exists") {
            this.translate.get('SIGNUP.USER_EMAIL_EXISTS').subscribe((translatedText: string) => {
              Swal.fire({
                text: translatedText,
                icon: "error",
                showConfirmButton: false,
                timer: 2000
              });
            });
          } else {
            Swal.fire({
              text: error.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            });
          }
          return throwError(error);
        })
      ).subscribe();
    }
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

  getAddress(cep: string) {
    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((endereco: any) => {
      this.perfilUsuario.userAddress.postalCode = endereco.cep;
      this.perfilUsuario.userAddress.street = endereco.logradouro;
      this.perfilUsuario.userAddress.city = endereco.localidade;
      this.perfilUsuario.userAddress.state = endereco.uf;
    })
  }

}
