import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Autenticacao } from './model/login.model';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';

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
    // this.signupForm = this.formBuilder.group({
    //   cpf: ['', Validators.required],
    //   nome: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   senha: ['', [Validators.required, Validators.minLength(6)]],
    //   endereco: ['', Validators.required],
    //   telefone: ['', Validators.required]
    // });
  }

  // onSignUp() {
  //   if (this.signupForm.valid) {
  //     console.log(this.signupForm.value);
  //   } else {
  //     console.log("Formulário de cadastro inválido");
  //   }
  // }

  public logar() {
    if (this.loginForm.valid) {
      let autenticacao = new Autenticacao();
      autenticacao.email = this.loginForm.get('email')?.value;
      autenticacao.password = this.loginForm.get('password')?.value;
  
      this.loginService.login(autenticacao).subscribe(retorno => {
        localStorage.setItem('token', retorno.token);
        alert("Usuário autenticado!\nRedirecionando...");
      },
      (err) => {alert("Usuário ou senha incorreto!")});
    }
  }
}
