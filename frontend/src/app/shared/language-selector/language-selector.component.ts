import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectorService } from './service/language-selector.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  @Output() languageChange = new EventEmitter<string>();
  selectedLanguage: string;
  dropdownOpen = false;

  languages = [
    { text: 'Português', value: 'pt-br', img: '../assets/brasil-flag-icon.png' },
    { text: 'English', value: 'en', img: '../assets/us-flag-icon.png' }
  ];

  constructor(
    private translate: TranslateService,
    private languageSelectorService: LanguageSelectorService
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

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
    this.translate.use(language);
    this.languageChange.emit(language);
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