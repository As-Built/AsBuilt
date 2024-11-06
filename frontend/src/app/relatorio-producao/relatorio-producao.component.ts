import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalServicoModel } from '../local-servico/model/local-servico.model';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { LocalServicoService } from '../local-servico/service/local-servico.service';
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
  displayedColumns: string[] = [];
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
  producao: ValorProducaoModel[] = [];
  totalValue: number = 0;
  listaConstrutoras: ConstrutoraModel[] = [];


  constructor(
    private usuarioService: UsuarioService,
    private valorProducaoService: ValorProducaoService,
    private localServicoService: LocalServicoService,
    private spinner: NgxSpinnerService
  ){}

  async ngOnInit() {
    await this.buscarUsuarios();
    this.getUserFromToken();
    this.updateDisplayedColumnsBuilder();
  }

  getUserFromToken() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token!) as any;
    this.userRole = decodedToken.user.roles[0];
    this.userName = decodedToken.user.name;
    this.userId = decodedToken.user.id;
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
      const producao = await firstValueFrom(this.valorProducaoService.buscarValorProducaoPorPeriodo(dataInicio, dataFim));
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
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  calcularTotal() {
    this.totalValue = this.producao.reduce((acc, curr) => acc + (curr.value || 0), 0);
    console.log(this.totalValue);
  }

  updateDisplayedColumnsBuilder() {
    this.displayedColumns = this.filtroConstrutoraSelecionado == null
      ? ["construtora", "centroCusto", "servico", "locationGroup", "subGroup1", "subGroup2", "data", "valor"]
      : ["centroCusto", "servico", "locationGroup", "subGroup1", "subGroup2", "data", "valor"];
  }

  updateDisplayedColumnsCostCenter() {
    this.displayedColumns = this.filtroCentroCustoSelecionado == null
      ? ["centroCusto", "servico", "locationGroup", "subGroup1", "subGroup2", "data", "valor"]
      : ["servico", "locationGroup", "subGroup1", "subGroup2", "data", "valor"];
  }

  updateDisplayedColumnsLocationGroup() {
    this.displayedColumns = this.filtroCentroCustoSelecionado == null
      ? ["servico", "locationGroup", "subGroup1", "subGroup2", "data", "valor"]
      : ["servico", "subGroup1", "subGroup2", "data", "valor"];
  }

  updateDisplayedColumnsSubGroup1() {
    this.displayedColumns = this.filtroCentroCustoSelecionado == null
      ? ["servico", "subGroup1", "subGroup2", "data", "valor"]
      : ["servico", "subGroup2", "data", "valor"];
  }

  // filtrarDados() {
  //   const construtoras = this.listaLocalServico.map(item => item.costCenter.builder);
  //   const uniqueConstrutoras: { [key: string]: any } = {}; //Adiciona um index a consulta para não trazer valores repetidos
  //   construtoras.forEach(c => {
  //     uniqueConstrutoras[c.builderName] = c;
  //   });
  //   this.listaConstrutorasConsulta = Object.values(uniqueConstrutoras);
  //   if (this.avaliacaoTab == 0) {
  //     this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora => 
  //       this.servicosAguardandoAvaliacao.some(servico => servico.costCenter.builder.builderName === construtora.builderName)
  //     );
  //   }
  //   if (this.avaliacaoTab == 1) {
  //     this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora => 
  //       this.servicosParaReavaliacao.some(servico => servico.costCenter.builder.builderName === construtora.builderName)
  //     );
  //   }
  //   if (this.avaliacaoTab == 2) {
  //     this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora => 
  //       this.servicosAvaliados.some(servico => servico.costCenter.builder.builderName === construtora.builderName)
  //     );
  //   }

  //   if (this.filtroConstrutoraSelecionado) {
  //     this.listaCentrosDeCustoFiltradaConsulta = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.builderName === this.filtroConstrutoraSelecionado);
  //     this.listaLocalServicoFiltrada = this.listaLocalServico.filter(localServico => localServico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
  //     if (this.avaliacaoTab == 0) {
  //       this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
  //     }
  //   } else {
  //     this.listaLocalServicoFiltrada = [...this.listaLocalServico];
  //   }

  //   if (this.filtroCentroCustoSelecionado) {
  //     if (this.avaliacaoTab == 0) {
  //       this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
  //     }
  //     this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);

  //     const uniqueLocationGroups: { [key: string]: LocalServicoModel } = {}; //Adiciona um index a consulta para não trazer valores repetidos
  //     this.listaLocalServicoFiltrada.forEach(localServico => {
  //       uniqueLocationGroups[localServico.locationGroup] = localServico;
  //     });
  //     this.listaLocationGroupFiltradaConsulta = Object.values(uniqueLocationGroups)
  //     if (this.avaliacaoTab == 0) {
  //       this.listaLocationGroupFiltradaConsulta = this.listaLocationGroupFiltradaConsulta.filter(local => 
  //         this.servicosAguardandoAvaliacao.some(servico => servico.taskLocation.locationGroup === local.locationGroup)
  //       );
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.listaLocationGroupFiltradaConsulta = this.listaLocationGroupFiltradaConsulta.filter(local => 
  //         this.servicosParaReavaliacao.some(servico => servico.taskLocation.locationGroup === local.locationGroup)
  //       );
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.listaLocationGroupFiltradaConsulta = this.listaLocationGroupFiltradaConsulta.filter(local => 
  //         this.servicosAvaliados.some(servico => servico.taskLocation.locationGroup === local.locationGroup)
  //       );
  //     }
  //   }

  //   if (this.filtroLocationGroup) {
  //     if (this.avaliacaoTab == 0) {
  //       this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);;
  //       this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);;
  //       this.listaLocalServicoFiltrada = this.servicosParaReavaliacaoFiltrados.map(servico => servico.taskLocation);
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);;
  //       this.listaLocalServicoFiltrada = this.servicosAvaliadosFiltrados.map(servico => servico.taskLocation);
  //     }
      
  //     this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.locationGroup === this.filtroLocationGroup);

  //     const uniqueLocationSubGroups1: { [key: string]: string } = {}; //Adiciona um index a consulta para não trazer valores repetidos
  //     this.listaLocalServicoFiltrada.forEach(localServico => {
  //       if (localServico.subGroup1) {
  //         uniqueLocationSubGroups1[localServico.subGroup1] = localServico.subGroup1;
  //       }
  //     });
  //     this.listaSubGroup1FiltradaConsulta = Object.values(uniqueLocationSubGroups1);
  //     if (this.avaliacaoTab == 0) {
  //       this.listaSubGroup1FiltradaConsulta = this.listaSubGroup1FiltradaConsulta.filter(subGroup1 => 
  //         this.servicosAguardandoAvaliacao.some(servico => servico.taskLocation.subGroup1 === subGroup1)
  //       );
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.listaSubGroup1FiltradaConsulta = this.listaSubGroup1FiltradaConsulta.filter(subGroup1 => 
  //         this.servicosParaReavaliacao.some(servico => servico.taskLocation.subGroup1 === subGroup1)
  //       );
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.listaSubGroup1FiltradaConsulta = this.listaSubGroup1FiltradaConsulta.filter(subGroup1 => 
  //         this.servicosAvaliados.some(servico => servico.taskLocation.subGroup1 === subGroup1)
  //       );
  //     }
  //   }

  //   if (this.filtroSubGroup1) {
  //     if (this.avaliacaoTab == 0) {
  //       this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
  //       this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
  //       this.listaLocalServicoFiltrada = this.servicosParaReavaliacaoFiltrados.map(servico => servico.taskLocation);
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
  //       this.listaLocalServicoFiltrada = this.servicosAvaliadosFiltrados.map(servico => servico.taskLocation);
  //     }
           
  //     this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup1 === this.filtroSubGroup1);

  //     const uniqueLocationSubGroups2: { [key: string]: string } = {};
  //     this.listaLocalServicoFiltrada.forEach(localServico => {
  //       if (localServico.subGroup2) {
  //         uniqueLocationSubGroups2[localServico.subGroup2] = localServico.subGroup2;
  //       }
  //     });
  //     this.listaSubGroup2FiltradaConsulta = Object.values(uniqueLocationSubGroups2);
  //     if (this.avaliacaoTab == 0) {
  //       this.listaSubGroup2FiltradaConsulta = this.listaSubGroup2FiltradaConsulta.filter(subGroup2 => 
  //         this.servicosAguardandoAvaliacao.some(servico => servico.taskLocation.subGroup2 === subGroup2)
  //       );
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.listaSubGroup2FiltradaConsulta = this.listaSubGroup2FiltradaConsulta.filter(subGroup2 => 
  //         this.servicosParaReavaliacao.some(servico => servico.taskLocation.subGroup2 === subGroup2)
  //       );
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.listaSubGroup2FiltradaConsulta = this.listaSubGroup2FiltradaConsulta.filter(subGroup2 => 
  //         this.servicosAvaliados.some(servico => servico.taskLocation.subGroup2 === subGroup2)
  //       );
  //     }
  //   }

  //   if (this.filtroSubGroup2) {
  //     if (this.avaliacaoTab == 0) {
  //       this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
  //       this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
  //     }
  //     if (this.avaliacaoTab == 1) {
  //       this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
  //       this.listaLocalServicoFiltrada = this.servicosParaReavaliacaoFiltrados.map(servico => servico.taskLocation);
  //     }
  //     if (this.avaliacaoTab == 2) {
  //       this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
  //       this.listaLocalServicoFiltrada = this.servicosAvaliadosFiltrados.map(servico => servico.taskLocation);
  //     }
      
  //     this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup2 === this.filtroSubGroup2);

  //     const uniqueLocationSubGroups3: { [key: string]: string } = {};
  //     this.listaLocalServicoFiltrada.forEach(localServico => {
  //       if (localServico.subGroup3) {
  //         uniqueLocationSubGroups3[localServico.subGroup3] = localServico.subGroup3;
  //       }
  //     });
  //   }
  // }

  // onConstrutoraChange() {
  //   this.listaCentrosDeCustoFiltrados = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.id === this.construtoraSelecionada.id);
  // }

  // limparFiltros() {
  //   this.filtroConstrutoraSelecionado = null;
  //   this.filtroCentroCustoSelecionado = null;
  //   this.filtroLocationGroup = null;
  //   this.filtroSubGroup1 = null;
  //   this.filtroSubGroup2 = null;
  //   this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
  //   this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
  //   this.servicosAvaliadosFiltrados = this.servicosAvaliados;
  //   this.updateDisplayedColumnsBuilder();
  //   this.filtrarDados();
  // }

  // onFiltroConstrutoraChange(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroConstrutoraSelecionado = null;
  //   } else {
  //     this.filtroConstrutoraSelecionado = novoFiltro;
  //   }
  //   this.filtroCentroCustoSelecionado = null;
  //   this.filtroLocationGroup = null;
  //   this.filtroSubGroup1 = null;
  //   this.filtroSubGroup2 = null;
  //   this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
  //   this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
  //   this.servicosAvaliadosFiltrados = this.servicosAvaliados;
  //   this.updateDisplayedColumnsBuilder();
  //   this.filtrarDados();
  // }

  // onFiltroCostCenterChange(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroCentroCustoSelecionado = null;
  //   } else {
  //     this.filtroCentroCustoSelecionado = novoFiltro;
  //   }
  //   this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
  //   this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
  //   this.servicosAvaliadosFiltrados = this.servicosAvaliados;
  //   this.filtroLocationGroup = null;
  //   this.filtroSubGroup1 = null;
  //   this.filtroSubGroup2 = null;
  //   this.updateDisplayedColumnsCostCenter();
  //   this.filtrarDados();
  // }

  // onFiltroLocationGroupChange(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroLocationGroup = null;
  //   } else {
  //     this.filtroLocationGroup = novoFiltro;
  //   }
  //   this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
  //   this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
  //   this.servicosAvaliadosFiltrados = this.servicosAvaliados;
  //   this.filtroSubGroup1 = null;
  //   this.filtroSubGroup2 = null;
  //   this.updateDisplayedColumnsLocationGroup()
  //   this.filtrarDados();
  // }

  // onFiltroSubGroup1Change(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroSubGroup1 = null;
  //   } else {
  //     this.filtroSubGroup1 = novoFiltro;
  //   }
  //   this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
  //   this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
  //   this.servicosAvaliadosFiltrados = this.servicosAvaliados;
  //   this.filtroSubGroup2 = null;
  //   this.updateDisplayedColumnsSubGroup1()
  //   this.filtrarDados();
  // }

  // onFiltroSubGroup2Change(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroSubGroup2 = null;
  //   } else {
  //     this.filtroSubGroup2 = novoFiltro;
  //   }
  //   this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
  //   this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
  //   this.servicosAvaliadosFiltrados = this.servicosAvaliados;
  //   this.filtrarDados();
  // }

  limparDados() {
    this.usuarioSelecionado = null;
    this.dataInicioPeriodoConsulta = new Date();
    this.dataFimPeriodoConsulta = new Date();
  }
}
