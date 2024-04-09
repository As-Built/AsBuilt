import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { Autenticacao } from './model/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  email: any;
  invalid: any;

  loginForm = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });
  // signupForm: FormGroup;


  constructor(private loginService: LoginService,
    private router: Router) { }

  ngOnInit() {
  }

  public signIn() {
    if (this.loginForm.valid) {
      let autenticacao = new Autenticacao();
      autenticacao.email = this.loginForm.get('email')?.value;
      autenticacao.password = this.loginForm.get('password')?.value;
  
      this.loginService.signIn(autenticacao).subscribe(retorno => {
        localStorage.setItem('token', retorno.token);
        alert("Usuário autenticado!\nRedirecionando...");
      },
      (err) => {alert("Usuário ou senha incorreto!")});
    }
  }
}
