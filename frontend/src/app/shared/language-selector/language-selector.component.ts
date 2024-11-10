import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectorService } from './service/language-selector.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PerfilUsuarioService } from '../../perfil-usuario/service/perfil-usuario.service';
import { firstValueFrom } from 'rxjs';
import { PerfilUsuarioModel } from '../../perfil-usuario/model/perfil-usuario.model';
import { IdiomaUsuarioModel } from '../../perfil-usuario/model/idioma-usuario.model';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  @Output() languageChange = new EventEmitter<string>();

  @Input() perfilUsuario: PerfilUsuarioModel = new PerfilUsuarioModel();

  idiomaUsuarioModel: IdiomaUsuarioModel = new IdiomaUsuarioModel();
  selectedLanguage: string;
  dropdownOpen = false;

  languages = [
    { text: 'Português', value: 'pt-br', img: '../assets/brasil-flag-icon.png' },
    { text: 'English', value: 'en', img: '../assets/us-flag-icon.png' }
  ];

  constructor(
    private translate: TranslateService,
    private languageSelectorService: LanguageSelectorService,
    private spinner: NgxSpinnerService,
    private perfilUsuarioService: PerfilUsuarioService
  ) {
    this.selectedLanguage = this.languageSelectorService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.selectedLanguage = this.translate.currentLang;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  async changeLanguage(language: string) {
    this.spinner.show();
    this.selectedLanguage = language;
    this.translate.use(language);
    this.languageChange.emit(language);
    this.idiomaUsuarioModel.id = this.perfilUsuario.id;
    this.idiomaUsuarioModel.systemLanguage = language;
    await firstValueFrom(this.perfilUsuarioService.updateIdiomaSistema(this.idiomaUsuarioModel));
    this.spinner.hide();
    this.toggleDropdown();
  }

  getSelectedLanguageImage(): string {
    const selectedLang = this.languages.find(lang => lang.value === this.selectedLanguage);
    return selectedLang ? selectedLang.img : '';
  }

  getSelectedLanguageText(): string {
    const selectedLang = this.languages.find(lang => lang.value === this.selectedLanguage);
    return selectedLang ? selectedLang.text : '';
  }
}