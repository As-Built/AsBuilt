import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { ServicoComponent } from './servico/servico.component';
import { CadastroServicoComponent } from './cadastro-servico/cadastro-servico.component';
import { CadastroCentroCustoComponent } from './cadastro-centro-custo/cadastro-centro-custo.component';
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


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsuarioComponent,
    CadastroUsuarioComponent,
    ServicoComponent,
    CadastroServicoComponent,
    CadastroCentroCustoComponent,
    SidebarComponent,
    ImageSliderComponent,
    NavbarComponent,
    LayoutComponent,
    ConstrutoraComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
