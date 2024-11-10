import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { PerfilUsuarioService } from '../../perfil-usuario/service/perfil-usuario.service';
import { lastValueFrom } from 'rxjs';
import { PerfilUsuarioModel } from '../../perfil-usuario/model/perfil-usuario.model';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectorService } from '../language-selector/service/language-selector.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  perfilUsuario = new PerfilUsuarioModel();
  profilePicture: string | null = null;
  
  constructor(private router: Router,
    private perfilUsuarioService: PerfilUsuarioService,
    private http: HttpClient,
    private translate: TranslateService,
    private localeService: LanguageSelectorService
  ) { }

  ngOnInit(): void {
    this.buscarPerfilUsuario();
  }

  isHomePage() {
    return this.router.url === '/home';
  }
  isNotHomeOrLogin() {
    return this.router.url !== '/home' && this.router.url !== '/login';
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

  logout() {
    localStorage.clear();
    const cookies = document.cookie.split(";");
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; //Seta o cookie para expirar em uma data anterior a atual para efeturar a limpeza de cookies do navegador
    }

    this.router.navigate(['/home']);
  }

  onLanguageChange(locale: string) {
    this.translate.use(locale);
}
  
}