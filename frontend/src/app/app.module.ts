import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { HttpClientModule } from '@angular/common/http';
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
    CronogramaComponent
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
  ],
  providers: [
    CurrencyPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
