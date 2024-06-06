import { Component } from '@angular/core';
import { CadastroUsuarioModel } from './model/cadastro-usuario.model';
import { CadastroUsuarioService } from './service/cadastro-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    private router: Router
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
    let nomeValidoRegex = /^[a-zA-Z]{3,}\s(?:[a-zA-Z]{3,}\s?)+$/;

    if (this.validaCPF(cadastroUsuarioModel.cpf) === false) {
      Swal.fire({
        text: "CPF ou CNPJ inválido!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (cadastroUsuarioModel.cpf === null || cadastroUsuarioModel.cpf.trim() === ""
      || cadastroUsuarioModel.cpf === undefined) {
      Swal.fire({
        text: "O campo 'CPF' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (cadastroUsuarioModel.name.length < 6) {
      Swal.fire({
        text: "O campo 'Nome' requer ao menos 6 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (cadastroUsuarioModel.name.length > 254) {
      Swal.fire({
        text: "O campo 'Nome' aceita no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (cadastroUsuarioModel.name === null || cadastroUsuarioModel.name.trim() === ""
      || cadastroUsuarioModel.name === undefined) {
      Swal.fire({
        text: "O campo 'Nome' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (!nomeValidoRegex.test(cadastroUsuarioModel.name)) {
      Swal.fire({
        text: "O nome digitado não possui um formato válido! Exemplo: 'Nome Sobrenome'",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (!emailRegex.test(cadastroUsuarioModel.email)) {
      Swal.fire({
        text: "O email digitado não possui um formato válido!",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (!passwordRegex.test(cadastroUsuarioModel.password)) {
      Swal.fire({
        text: "A senha deve conter no mínimo 8 caracteres e no máximo 12 caracteres, ao menos uma letra minúscula e ao menos uma letra maíuscula, ao menos um número e ao menos um dos seguintes caracteres especiais: @, $, !, %, *, #, ?, &",
        icon: "error",
        showConfirmButton: true
      });
      return;
    }

    if (cadastroUsuarioModel.password != confirmPassword) {
      Swal.fire({
        text: "As senhas não conferem!",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (cadastroUsuarioModel.password === null || cadastroUsuarioModel.password === ""
      || cadastroUsuarioModel.password === undefined) {
      Swal.fire({
        text: "O campo 'Senha' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (confirmPassword === null || confirmPassword === "" || confirmPassword === undefined) {
      Swal.fire({
        text: "Por favor confirme a sua senha",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (cadastroUsuarioModel.email === null || cadastroUsuarioModel.email === ""
      || cadastroUsuarioModel.email === undefined) {
      Swal.fire({
        text: "O campo 'Email' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
  
    if (this.cadastroUsuarioForm.valid) {
      this.cadastoUsuarioService.signUp(cadastroUsuarioModel).subscribe(retorno => {
        Swal.fire({
          text: "Usuário cadastrado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          location.reload();
        });
      },
        (error) => {
          if (error.error === "A user with same CPF already exists") {
            Swal.fire({
              text: "Já existe um usuário cadastrado com este CPF!",
              icon: "error"
            });
          }
          if (error.error === "A user with same EMAIL already exists") {
            Swal.fire({
              text: "Já existe um usuário cadastrado com este email!",
              icon: "error"
            });
          }
          else {
            Swal.fire({
              html: "Erro ao cadastar o usuário!<br>" + error.error,
              icon: "error",
            });
          }
        });
    }
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
