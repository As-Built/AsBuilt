import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalServicoModel } from '../local-servico/model/local-servico.model';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { ValorProducaoService } from '../shared/service/valor-producao.service';
import { ValorProducaoModel } from '../shared/model/valor-producao.model';
import { jwtDecode } from "jwt-decode";
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from '../usuario/service/usuario.service';
import { UsuarioModel } from '../usuario/model/usuario.model';

@Component({
  selector: 'app-relatorio-producao',
  templateUrl: './relatorio-producao.component.html',
  styleUrls: ['./relatorio-producao.component.scss']
})
export class RelatorioProducaoComponent implements OnInit {

  userName: string = "";
  userId: number = 0;
  userRole: string = "";
  usuarios: UsuarioModel[] = [];
  usuarioSelecionado: UsuarioModel | null = null;
  dataInicioPeriodoConsulta: Date | null = null;
  dataFimPeriodoConsulta: Date | null = null;
  displayedColumns: string[] = ["construtora", "centroCusto", "servico", "locationGroup", "subGroup1", "subGroup2", "data", "valor"];
  producao: ValorProducaoModel[] = [];
  totalValue: number = 0;
  listaConstrutoras: ConstrutoraModel[] = [];
  buscaRealizada: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private valorProducaoService: ValorProducaoService,
    private spinner: NgxSpinnerService
  ){}

  async ngOnInit() {
    this.getUserFromToken();
    if (this.userRole !== 'FUNCIONARIO') {
      await this.buscarUsuarios();
    }
    else {
      await this.buscarUsarioPorId(this.userId);
    }
  }

  getUserFromToken() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token!) as any;
    this.userRole = decodedToken.user.roles[0];
    this.userName = decodedToken.user.name;
    this.userId = decodedToken.user.id;
  }

  async buscarUsarioPorId(id: number) {
    this.spinner.show();
    try {
      const usuario = await firstValueFrom(this.usuarioService.buscarUsuarioPorId(id));
      this.usuarioSelecionado = usuario;
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  async buscarUsuarios() {
    this.spinner.show();
    try {
      const usuarios = await firstValueFrom(this.usuarioService.listarUsuarios());
      this.usuarios = usuarios;
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  async buscarValorProducaoPorPeriodo(dataInicio: Date, dataFim: Date) {
    this.spinner.show();
    try {
      const producao = await firstValueFrom(this.valorProducaoService.buscarValorProducaoPorPeriodo(new Date(dataInicio), new Date(dataFim)));
      this.producao = producao;
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  async buscarValorProducaoPorPeriodoEUsuarioId(dataInicio: Date, dataFim: Date, usuarioId: number) {
    this.spinner.show();
    try {
      const producao = await firstValueFrom(this.valorProducaoService.buscarValorProducaoPorPeriodoEUsuarioId(new Date(dataInicio), new Date(dataFim), usuarioId));
      this.producao = producao.filter(p => p.value > 0); // Remove resultados com valor 0 (Avaliação reprovada)
      this.calcularTotal();
      this.buscaRealizada = true;
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  calcularTotal() {
    this.totalValue = this.producao.reduce((acc, curr) => acc + (curr.value || 0), 0);
    console.log(this.totalValue);
  }

   limparDados() {
    this.usuarioSelecionado = null;
    this.dataInicioPeriodoConsulta = null;
    this.dataFimPeriodoConsulta = null;
    this.buscaRealizada = false;
    this.producao = [];
  }
}
