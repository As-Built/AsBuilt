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
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { LocalServicoService } from '../local-servico/service/local-servico.service';

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
  producaoFiltrada: ValorProducaoModel[] = [];
  totalValue: number = 0;
  listaConstrutoras: ConstrutoraModel[] = [];
  buscaRealizada: boolean = false;
  filtroConstrutoraSelecionado: string | null = null;
  filtroCentroCustoSelecionado: string | null = null;
  listaLocalServicoFiltrada: LocalServicoModel[] = [];
  listaConstrutorasConsulta: ConstrutoraModel[] = [];
  listaCentrosDeCustoFiltradaConsulta: CentroCustoModel[] = [];
  construtoraFiltro: string | null = null;
  filtroLocationGroup: string | null = null;
  listaLocationGroupFiltradaConsulta: LocalServicoModel[] = [];
  filtroSubGroup1: string | null = null;
  filtroSubGroup2: string | null = null;
  listaSubGroup1FiltradaConsulta: string[] = [];
  listaSubGroup2FiltradaConsulta: string[] = [];
  listaLocalServico: LocalServicoModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  listaCentrosDeCustoFiltrados: CentroCustoModel[] = [];
  construtoraSelecionada: ConstrutoraModel = new ConstrutoraModel();

  constructor(
    private usuarioService: UsuarioService,
    private valorProducaoService: ValorProducaoService,
    private spinner: NgxSpinnerService,
    private localServicoService: LocalServicoService,
    private construtoraService: ConstrutoraService,
    private centroCustoService: CentroCustoService
  ){}

  async ngOnInit() {
    this.getUserFromToken();
    if (this.userRole !== 'FUNCIONARIO') {
      await this.buscarUsuarios();
    }
    else {
      await this.buscarUsarioPorId(this.userId);
    }
    this.buscarLocais();
    this.buscarConstrutoras();
    this.buscarCentrosDeCusto();
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
      this.producaoFiltrada = producao;
      this.calcularTotal();
      this.buscaRealizada = true;
      this.filtrarDados();
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
      this.producaoFiltrada = producao.filter(p => p.value > 0);
      this.calcularTotal();
      this.buscaRealizada = true;
      this.filtrarDados();
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  calcularTotal() {
    this.totalValue = this.producaoFiltrada.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }

   limparDados() {
    this.usuarioSelecionado = null;
    this.dataInicioPeriodoConsulta = null;
    this.dataFimPeriodoConsulta = null;
    this.buscaRealizada = false;
    this.producao = [];
    this.producaoFiltrada = [];
  }

  async buscarLocais() {
    try {
      const locaisServico: any = await firstValueFrom(this.localServicoService.listarLocais());
      this.listaLocalServico = locaisServico;
      this.filtrarDados();
    } catch (error) {
      console.error(error);
    }
  }

  async buscarConstrutoras() {
    try {
      const construtoras: any = await firstValueFrom(this.construtoraService.listarConstrutoras());
      this.listaConstrutoras = construtoras;
    } catch (error) {
      console.error(error);
    }
  }

  async buscarCentrosDeCusto() {
    try {
      const centros: any = await firstValueFrom(this.centroCustoService.listarCentrosDeCusto());
      this.listaCentrosDeCusto = centros;
    } catch (error) {
      console.error(error);
    }
  }

  filtrarDados() {
    const construtoras = this.listaLocalServico.map(item => item.costCenter.builder);
    const uniqueConstrutoras: { [key: string]: any } = {}; //Adiciona um index a consulta para não trazer valores repetidos
    construtoras.forEach(c => {
      uniqueConstrutoras[c.builderName] = c;
    });
    this.listaConstrutorasConsulta = Object.values(uniqueConstrutoras);
    this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora => 
      this.producao.some(servico => servico.task.costCenter.builder.builderName === construtora.builderName)
    );

    if (this.filtroConstrutoraSelecionado) {
      this.listaCentrosDeCustoFiltradaConsulta = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.builderName === this.filtroConstrutoraSelecionado);
      this.listaLocalServicoFiltrada = this.listaLocalServico.filter(localServico => localServico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      this.producaoFiltrada = this.producaoFiltrada.filter(servico => servico.task.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      this.calcularTotal();
    } else {
      this.listaLocalServicoFiltrada = [...this.listaLocalServico];
    }

    if (this.filtroCentroCustoSelecionado) {
      this.producaoFiltrada = this.producaoFiltrada.filter(localServico => localServico.task.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);

      const uniqueLocationGroups: { [key: string]: LocalServicoModel } = {}; //Adiciona um index a consulta para não trazer valores repetidos
      this.listaLocalServicoFiltrada.forEach(localServico => {
        uniqueLocationGroups[localServico.locationGroup] = localServico;
      });
      this.listaLocationGroupFiltradaConsulta = Object.values(uniqueLocationGroups)
      this.listaLocationGroupFiltradaConsulta = this.listaLocationGroupFiltradaConsulta.filter(local => 
        this.producao.some(servico => servico.task.taskLocation.locationGroup === local.locationGroup)
      );
      this.calcularTotal();
    }

    if (this.filtroLocationGroup) {
      this.producaoFiltrada = this.producaoFiltrada.filter(localServico => localServico.task.taskLocation.locationGroup === this.filtroLocationGroup);;
      this.listaLocalServicoFiltrada = this.producaoFiltrada.map(servico => servico.task.taskLocation);
      
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.locationGroup === this.filtroLocationGroup);

      const uniqueLocationSubGroups1: { [key: string]: string } = {}; //Adiciona um index a consulta para não trazer valores repetidos
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup1) {
          uniqueLocationSubGroups1[localServico.subGroup1] = localServico.subGroup1;
        }
      });
      this.listaSubGroup1FiltradaConsulta = Object.values(uniqueLocationSubGroups1);
      this.listaSubGroup1FiltradaConsulta = this.listaSubGroup1FiltradaConsulta.filter(subGroup1 => 
        this.producao.some(servico => servico.task.taskLocation.subGroup1 === subGroup1)
      );
      this.calcularTotal();
    }

    if (this.filtroSubGroup1) {
      this.producaoFiltrada = this.producaoFiltrada.filter(localServico => localServico.task.taskLocation.subGroup1 === this.filtroSubGroup1);
      this.listaLocalServicoFiltrada = this.producaoFiltrada.map(servico => servico.task.taskLocation);
           
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup1 === this.filtroSubGroup1);

      const uniqueLocationSubGroups2: { [key: string]: string } = {};
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup2) {
          uniqueLocationSubGroups2[localServico.subGroup2] = localServico.subGroup2;
        }
      });
      this.listaSubGroup2FiltradaConsulta = Object.values(uniqueLocationSubGroups2);
      this.listaSubGroup2FiltradaConsulta = this.listaSubGroup2FiltradaConsulta.filter(subGroup2 => 
        this.producao.some(servico => servico.task.taskLocation.subGroup2 === subGroup2)
      );
      this.calcularTotal();
    }

    if (this.filtroSubGroup2) {
      this.producaoFiltrada = this.producaoFiltrada.filter(localServico => localServico.task.taskLocation.subGroup2 === this.filtroSubGroup2);
      this.listaLocalServicoFiltrada = this.producaoFiltrada.map(servico => servico.task.taskLocation);
      
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup2 === this.filtroSubGroup2);

      const uniqueLocationSubGroups3: { [key: string]: string } = {};
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup3) {
          uniqueLocationSubGroups3[localServico.subGroup3] = localServico.subGroup3;
        }
      });
      this.calcularTotal();
    }
  }

  onConstrutoraChange() {
    this.listaCentrosDeCustoFiltrados = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.id === this.construtoraSelecionada.id);
  }

  limparFiltros() {
    this.filtroConstrutoraSelecionado = null;
    this.filtroCentroCustoSelecionado = null;
    this.filtroLocationGroup = null;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.producaoFiltrada = this.producao;
    this.calcularTotal();
    this.filtrarDados();
  }

  onFiltroConstrutoraChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroConstrutoraSelecionado = null;
    } else {
      this.filtroConstrutoraSelecionado = novoFiltro;
    }
    this.filtroCentroCustoSelecionado = null;
    this.filtroLocationGroup = null;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.producaoFiltrada = this.producao;
    this.filtrarDados();
  }

  onFiltroCostCenterChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroCentroCustoSelecionado = null;
    } else {
      this.filtroCentroCustoSelecionado = novoFiltro;
    }
    this.producaoFiltrada = this.producao;
    this.filtroLocationGroup = null;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.filtrarDados();
  }

  onFiltroLocationGroupChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroLocationGroup = null;
    } else {
      this.filtroLocationGroup = novoFiltro;
    }
    this.producaoFiltrada = this.producao;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.filtrarDados();
  }

  onFiltroSubGroup1Change(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSubGroup1 = null;
    } else {
      this.filtroSubGroup1 = novoFiltro;
    }
    this.producaoFiltrada = this.producao;
    this.filtroSubGroup2 = null;
    this.filtrarDados();
  }

  onFiltroSubGroup2Change(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSubGroup2 = null;
    } else {
      this.filtroSubGroup2 = novoFiltro;
    }
    this.producaoFiltrada = this.producao;
    this.filtrarDados();
  }
}
