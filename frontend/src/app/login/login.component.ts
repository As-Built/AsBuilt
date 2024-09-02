import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../usuario/model/usuario.model';
import { Autenticacao } from './model/login.model';
import { LoginService } from './service/login.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public showPassword: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',Validators.required),
  });

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.clear();
  }

  public signIn() {
    let autenticacao = new Autenticacao();
    autenticacao.email = this.loginForm.get('email')?.value;
    autenticacao.password = this.loginForm.get('password')?.value;
    // Expressão regular para validar o formato do email
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(autenticacao.email)) {
      Swal.fire({
        text: "O email digitado não possui um formato válido!",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (autenticacao.email === null || autenticacao.email === "" || autenticacao.email === undefined) {
      Swal.fire({
        text: "O campo 'Email' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (autenticacao.password === "" || autenticacao.password === null || autenticacao.password === undefined) {
      Swal.fire({
        text: "O campo 'Senha' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (this.loginForm.valid) {
      this.loginService.signIn(autenticacao).subscribe(retorno => {
        localStorage.setItem('token', retorno.token);
        Swal.fire({
          text: "Usuário autenticado com sucesso!\nRedirecionando...",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
  
        const payload = JSON.parse(atob(retorno.token.split('.')[1]));
        const authority = payload.user.roles[0];
  
        if (authority === "ADMIN" || authority === "CONFERENTE") {
          this.router.navigate(['servico']);
        } else if (authority === "FUNCIONARIO") {
          this.router.navigate(['perfilUsuario']);
        } else {
          // Redirecionamento padrão para algum lugar caso a autoridade não seja "ADMIN", "CONFERENTE" ou "FUNCIONARIO"
          this.router.navigate(['home']);
        }
      });
    },
    (err) => {
        Swal.fire({
          text: "Usuário ou Senha incorreto!",
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }
  
  recuperarSenha() {
    Swal.fire({
      title: "Recuperar Senha",
      html: "Digite seu e-mail para recuperar a senha",
      input: "email",
      showCancelButton: true,
      confirmButtonText: "Recuperar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#dc3545"
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginForm.get('email')?.setValue(result.value);
        this.loginService.recuperarSenha(this.loginForm.get('email')?.value || '').subscribe(
          (retorno) => {
            Swal.fire({
              html: "Email enviado com sucesso para <br>" + this.loginForm.get('email')?.value,
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
          },
          (err) => {
            Swal.fire({
              html: "Erro ao enviar email!<br>Verifique o e-mail informado e tente novamente.",
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
          }
        );
      }
    });
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      this.showPassword = true;
    } else {
      passwordInput.type = "password";
      this.showPassword = false;
    }
  }

  cadastrar() {
    this.router.navigate(['/api/usuario']);
  }
}