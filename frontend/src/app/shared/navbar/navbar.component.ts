import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  isHomePage() {
    return this.router.url === '/home';
  }
  isNotHomeOrLogin() {
    return this.router.url !== '/home' && this.router.url !== '/login';
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
}