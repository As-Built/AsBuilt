import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private router: Router) { }
  
  ngOnInit() {
    // Seta o scroll para o topo da página ao mudar de rota
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  public get mostrarSidebar(): boolean {
    const url = this.router.url;
    return !['/home','/login'].includes(url);
  }
}