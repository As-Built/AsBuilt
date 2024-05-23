import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ServicoComponent} from './servico/servico.component';
import { CentroCustoComponent } from './centro-custo/centro-custo.component';
import { AuthGuard } from './shared/authguard/authguard.guard';
import { ConstrutoraComponent } from './construtora/construtora.component';
import { LocalServicoComponent } from './local-servico/local-servico.component';
import { TipoServicoComponent } from './tipo-servico/tipo-servico.component';
import { UnidadeMedidaComponent } from './unidade-medida/unidade-medida.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'servico', component: ServicoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'centroCusto', component: CentroCustoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'construtora', component: ConstrutoraComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'localServico', component: LocalServicoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'tipoServico', component: TipoServicoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'unidadeDeMedida', component: UnidadeMedidaComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
