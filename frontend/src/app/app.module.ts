import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { CentroCustoComponent } from './centro-custo/centro-custo.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ImageSliderComponent } from './shared/image-slider/image-slider.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponent } from './shared/layout/layout.component';
import { MatFormFieldModule} from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { ConstrutoraComponent } from './construtora/construtora.component';
import {MatTable, MatTableModule} from '@angular/material/table';
import { CnpjPipe } from './shared/pipes/cnpj.pipe';
import { TelefonePipe } from './shared/pipes/telefone.pipe';
import { RealPipe } from './shared/pipes/currency-reais.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LocalServicoComponent } from './local-servico/local-servico.component';
import { TipoServicoComponent } from './tipo-servico/tipo-servico.component';
import { UnidadeMedidaComponent } from './unidade-medida/unidade-medida.component';
import { ServicoComponent } from './servico/servico.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { MatMenuModule } from '@angular/material/menu';
import { AvaliacaoComponent } from './avaliacao/avaliacao.component';
import { AssessmentResultPipe } from './shared/pipes/assessment-result.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CronogramaComponent } from './cronograma/cronograma.component';
import { NgChartsModule } from 'ng2-charts';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelatorioProducaoComponent } from './relatorio-producao/relatorio-producao.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSelectorComponent } from './shared/language-selector/language-selector.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { LanguageSelectorService } from './shared/language-selector/service/language-selector.service';
import { CustomCurrencyPipe } from './shared/pipes/custom-currency.pipe';

// Função de fábrica para o TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localePt);
registerLocaleData(localeEn);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsuarioComponent,
    CadastroUsuarioComponent,
    ServicoComponent,
    CentroCustoComponent,
    SidebarComponent,
    ImageSliderComponent,
    NavbarComponent,
    LayoutComponent,
    ConstrutoraComponent,
    CnpjPipe,
    TelefonePipe,
    RealPipe,
    AssessmentResultPipe,
    LocalServicoComponent,
    TipoServicoComponent,
    UnidadeMedidaComponent,
    PerfilUsuarioComponent,
    AvaliacaoComponent,
    CronogramaComponent,
    ConfiguracaoComponent,
    DashboardComponent,
    RelatorioProducaoComponent,
    LanguageSelectorComponent,
    CustomCurrencyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyMaskModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
    BrowserAnimationsModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskModule.forRoot(), //npm i ngx-mask@13.1.13
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    NgxSpinnerModule,
    NgChartsModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    CurrencyPipe,
    {
      provide: MAT_DATE_LOCALE,
      deps: [LanguageSelectorService],
      useFactory: (localeService: LanguageSelectorService) => localeService.getLocale()
    },
    {
      provide: LOCALE_ID,
      deps: [LanguageSelectorService],
      useFactory: (localeService: LanguageSelectorService) => localeService.getLocale()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
