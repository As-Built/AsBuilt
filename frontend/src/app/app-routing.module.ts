import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ServicoComponent } from './servico/servico.component';
import { CadastroServicoComponent} from './cadastro-servico/cadastro-servico.component';
import { CadastroCentroCustoComponent } from './cadastro-centro-custo/cadastro-centro-custo.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', 
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: 'home', component: HomeComponent },
  { path: 'servico', component: ServicoComponent },
  { path: 'cadastroservico', component: CadastroServicoComponent },
  { path: 'cadastroCentroCusto', component: CadastroCentroCustoComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
