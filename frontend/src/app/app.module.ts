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
import { LayoutComponent } from './layout/layout.component';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsuarioComponent,
    CadastroUsuarioComponent,
    ServicoComponent,
    CadastroServicoComponent,
    CadastroCentroCustoComponent,
    SidebarComponent,
    LayoutComponent,
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
