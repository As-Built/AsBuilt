import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../usuario/model/usuario.model';
import { Autenticacao } from './model/login.model';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuarioLogado: UsuarioModel = new UsuarioModel();
  listaUsuarios: UsuarioModel[] = [];
  hide: boolean = true;
  email: any;
  invalid: any;

  loginForm = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });


  constructor(private loginService: LoginService,
    private router: Router) { }

  ngOnInit(): void {
    localStorage.clear();
  }

  public signIn() {
    if (this.loginForm.valid) {
      let autenticacao = new Autenticacao();
      autenticacao.email = this.loginForm.get('email')?.value;
      autenticacao.password = this.loginForm.get('password')?.value;
  
      this.loginService.signIn(autenticacao).subscribe(retorno => {
        localStorage.setItem('token', retorno.token);
        alert("Usuário autenticado!\nRedirecionando...");
  
        const payload = JSON.parse(atob(retorno.token.split('.')[1]));
        const authority = payload.user.roles[0];
  
        if (authority === "ADMIN") {
          this.router.navigate(['cadastroServico']);
        } else if (authority === "2") {
          this.router.navigate(['/api/dashboard-usuario']);
        } else {
          // Redirecionamento padrão para algum lugar caso a autoridade não seja "1" ou "2"
          this.router.navigate(['/api/home']);
        }
      },
      (err) => {alert("Usuário ou senha incorreto!")});
    }
  }
  
  
  public esqueciSenha(){
    alert("Problema é seu!");
  }

  cadastrar() {
    this.router.navigate(['/api/usuario']);
  }
}