import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Autenticacao } from './model/login.model';
import { LoginService } from './service/login.service';
import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public showPassword: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
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
      this.translate.get('LOGIN.INVALID_EMAIL_FORMAT').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (autenticacao.email === null || autenticacao.email === "" || autenticacao.email === undefined) {
      this.translate.get('LOGIN.EMAIL_REQUIRED').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (autenticacao.password === "" || autenticacao.password === null || autenticacao.password === undefined) {
      this.translate.get('LOGIN.PASSWORD_REQUIRED').subscribe((translatedText: string) => {
        Swal.fire({
          text: translatedText,
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        });
      });
      return;
    }

    if (this.loginForm.valid) {
      this.spinner.show();
      this.loginService.signIn(autenticacao).subscribe(retorno => {
        localStorage.setItem('token', retorno.token);
        this.spinner.hide();
        this.translate.get('LOGIN.USER_AUTHENTICATED').subscribe((translatedText: string) => {
          Swal.fire({
            text: translatedText,
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          }).then(() => {

            const payload = JSON.parse(atob(retorno.token.split('.')[1]));
            const authority = payload.user.roles[0];

            this.spinner.show();
            this.router.navigate(['dashboard']);
            this.spinner.hide();
          });
        });
      },
        (err) => {
          this.spinner.hide();
          this.translate.get('LOGIN.INVALID_USER_OR_PASSWORD').subscribe((translatedText: string) => {
            Swal.fire({
              text: translatedText,
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            });
          });
      });
    }
  }

  recuperarSenha() {
    this.translate.get([
      'PASSWORD_RECOVERY.TITLE',
      'PASSWORD_RECOVERY.INSTRUCTION',
      'PASSWORD_RECOVERY.CONFIRM_BUTTON',
      'PASSWORD_RECOVERY.CANCEL_BUTTON',
      'PASSWORD_RECOVERY.SUCCESS_MESSAGE',
      'PASSWORD_RECOVERY.ERROR_MESSAGE'
    ]).subscribe(translations => {
      Swal.fire({
        title: translations['PASSWORD_RECOVERY.TITLE'],
        html: translations['PASSWORD_RECOVERY.INSTRUCTION'],
        input: "email",
        showCancelButton: true,
        confirmButtonText: translations['PASSWORD_RECOVERY.CONFIRM_BUTTON'],
        cancelButtonText: translations['PASSWORD_RECOVERY.CANCEL_BUTTON'],
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#dc3545"
      }).then((result) => {
        if (result.isConfirmed) {
          this.loginForm.get('email')?.setValue(result.value);
          this.loginService.recuperarSenha(this.loginForm.get('email')?.value || '').subscribe(
            (retorno) => {
              Swal.fire({
                html: translations['PASSWORD_RECOVERY.SUCCESS_MESSAGE'] + this.loginForm.get('email')?.value,
                icon: "success",
                showConfirmButton: false,
                timer: 2000
              });
            },
            (err) => {
              Swal.fire({
                html: translations['PASSWORD_RECOVERY.ERROR_MESSAGE'],
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
            }
          );
        }
      });
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