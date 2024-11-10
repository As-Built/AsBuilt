import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageSelectorService {
  private languages = ['en', 'pt-br'];
  private defaultLanguage = 'en';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(this.languages);
    this.translate.setDefaultLang(this.defaultLanguage);
    const browserLang = this.translate.getBrowserLang();
    this.translate.use((browserLang?.match(/en|pt-br/) ? browserLang : this.defaultLanguage) ?? this.defaultLanguage);
  }

  getLanguages() {
    return this.languages;
  }

  getDefaultLanguage() {
    return this.defaultLanguage;
  }

  getCurrentLanguage() {
    return this.translate.currentLang || this.defaultLanguage;
  }

  getLocale() {
    const currentLanguage = this.getCurrentLanguage();
    return currentLanguage === 'pt-br' ? 'pt-br' : 'en';
  }
}