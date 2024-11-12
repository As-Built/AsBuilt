import { Component } from '@angular/core';
import { CadastroUsuarioModel } from './model/cadastro-usuario.model';
import { CadastroUsuarioService } from './service/cadastro-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent {

  cadastroModel = new CadastroUsuarioModel();

  public showPassword: boolean = false;

  constructor(
    private cadastoUsuarioService: CadastroUsuarioService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  cadastroUsuarioForm = new FormGroup({
    cpf: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    passwordCadastro: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });


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

  validaCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj === '') return false;
    if (cnpj.length !== 14) return false;
    if (cnpj === "00000000000000" ||
      cnpj === "11111111111111" ||
      cnpj === "22222222222222" ||
      cnpj === "33333333333333" ||
      cnpj === "44444444444444" ||
      cnpj === "55555555555555" ||
      cnpj === "66666666666666" ||
      cnpj === "77777777777777" ||
      cnpj === "88888888888888" ||
      cnpj === "99999999999999"
    ) {
      return false;
    }
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    let i: number; // Declare the variable 'i' here
    for (i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    return true;
  }

  async signUp() {
    let cadastroUsuarioModel = new CadastroUsuarioModel();
    cadastroUsuarioModel.cpf = this.cadastroUsuarioForm.get('cpf')?.value ?? '';
    cadastroUsuarioModel.name = this.cadastroUsuarioForm.get('name')?.value ?? '';
    cadastroUsuarioModel.email = this.cadastroUsuarioForm.get('email')?.value ?? '';
    cadastroUsuarioModel.password = this.cadastroUsuarioForm.get('passwordCadastro')?.value ?? '';

    let confirmPassword = this.cadastroUsuarioForm.get('confirmPassword')?.value ?? '';
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
    let nomeValidoRegex = /^[a-zA-ZÀ-ÿ]{3,}\s(?:[a-zA-ZÀ-ÿ]{2,}\s?)+$/;

    if (this.validaCPF(cadastroUsuarioModel.cpf) === false) {
      this.translate.get('SIGNUP.INVALID_CPF_CNPJ').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (cadastroUsuarioModel.cpf === null || cadastroUsuarioModel.cpf.trim() === ""
      || cadastroUsuarioModel.cpf === undefined) {
      this.translate.get('SIGNUP.CPF_REQUIRED').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (cadastroUsuarioModel.name.length < 6) {
      this.translate.get('SIGNUP.NAME_MIN_LENGTH').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (cadastroUsuarioModel.name.length > 254) {
      this.translate.get('SIGNUP.NAME_MAX_LENGTH').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (cadastroUsuarioModel.name === null || cadastroUsuarioModel.name.trim() === ""
      || cadastroUsuarioModel.name === undefined) {
      this.translate.get('SOGNUP.NAME_REQUIRED').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    let testName = nomeValidoRegex.test(cadastroUsuarioModel.name);

    if (!testName) {
      this.translate.get('SIGNUP.NAME_INVALID_FORMAT').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (!emailRegex.test(cadastroUsuarioModel.email)) {
      this.translate.get('SIGNUP.EMAIL_INVALID_FORMAT').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (!passwordRegex.test(cadastroUsuarioModel.password)) {
      this.translate.get('SIGNUP.PASSWORD_REQUIREMENTS').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "error",
          showConfirmButton: true
        });
      });
      return;
    }

    if (cadastroUsuarioModel.password != confirmPassword) {
      this.translate.get('SIGNUP.PASSWORDS_DO_NOT_MATCH').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (cadastroUsuarioModel.password === null || cadastroUsuarioModel.password === ""
      || cadastroUsuarioModel.password === undefined) {
      this.translate.get('SIGNUP.PASSWORD_REQUIRED').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (confirmPassword === null || confirmPassword === "" || confirmPassword === undefined) {
      this.translate.get('SIGNUP.CONFIRM_PASSWORD').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (cadastroUsuarioModel.email === null || cadastroUsuarioModel.email === ""
      || cadastroUsuarioModel.email === undefined) {
      this.translate.get('SIGNUP.EMAIL_REQUIRED').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (this.cadastroUsuarioForm.valid) {
      this.spinner.show();
      this.cadastoUsuarioService.signUp(cadastroUsuarioModel).subscribe(retorno => {
        this.spinner.hide();
        this.translate.get('SIGNUP.USER_REGISTERED').subscribe((translatedText: string) => {
          Swal.fire({
            text: translatedText,
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            location.reload();
          });
        });
      },
        (error) => {
          this.spinner.hide();
          if (error.error === "A user with same CPF already exists") {
            this.translate.get('SIGNUP.USER_CPF_EXISTS').subscribe((translatedText: string) => {
              Swal.fire({
                text: translatedText,
                icon: "error"
              });
            });
          } else if (error.error === "A user with same EMAIL already exists") {
            this.translate.get('SIGNUP.USER_EMAIL_EXISTS').subscribe((translatedText: string) => {
              Swal.fire({
                text: translatedText,
                icon: "error"
              });
            });
          } else {
            this.translate.get('SIGNUP.USER_REGISTRATION_ERROR').subscribe((translatedText: string) => {
              Swal.fire({
                html: translatedText + "<br>" + error.error,
                icon: "error",
              });
            });
          }
        }
      )
    };
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordCadastro') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      confirmPasswordInput.type = "text";
      this.showPassword = true;
    } else {
      passwordInput.type = "password";
      confirmPasswordInput.type = "password";
      this.showPassword = false;
    }
  }

}
