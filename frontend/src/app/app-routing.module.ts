import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CadastroServicoComponent} from './cadastro-servico/cadastro-servico.component';
import { CadastroCentroCustoComponent } from './cadastro-centro-custo/cadastro-centro-custo.component';
import { AuthGuard } from './shared/authguard/authguard.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastroServico', component: CadastroServicoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'cadastroCentroCusto', component: CadastroCentroCustoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
