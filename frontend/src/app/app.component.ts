import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectorService } from './shared/language-selector/service/language-selector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(
    private router: Router,
    private translate: TranslateService,
    private languageSelectorService: LanguageSelectorService
  ) {
    // this.translate.setDefaultLang('pt-br');
    this.translate.setDefaultLang(this.languageSelectorService.getDefaultLanguage());
   }
  
  ngOnInit() {
    // Seta o scroll para o topo da página ao mudar de rota
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    // Define a língua selecionada no início
    this.translate.use(this.languageSelectorService.getDefaultLanguage());
  }

  public get mostrarSidebar(): boolean {
    const url = this.router.url;
    return !['/home','/login'].includes(url);
  }

  changeLanguage(language: string) {
    this.translate.use(language);
  }
}