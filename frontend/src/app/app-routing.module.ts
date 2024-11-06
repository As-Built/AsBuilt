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
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AvaliacaoComponent } from './avaliacao/avaliacao.component';
import { CronogramaComponent } from './cronograma/cronograma.component';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelatorioProducaoComponent } from './relatorio-producao/relatorio-producao.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'avaliacao', component: AvaliacaoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'servico', component: ServicoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'centroCusto', component: CentroCustoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'construtora', component: ConstrutoraComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'localServico', component: LocalServicoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'tipoServico', component: TipoServicoComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'unidadeDeMedida', component: UnidadeMedidaComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'cronograma', component: CronogramaComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN', 'CONFERENTE'] } },
  { path: 'perfilUsuario', component: PerfilUsuarioComponent },
  { path: 'configuracao', component: ConfiguracaoComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'relatorio-producao', component: RelatorioProducaoComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
