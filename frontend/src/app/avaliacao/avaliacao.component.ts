import { Component, OnInit } from '@angular/core';
import { AvaliacaoService } from './service/avaliacao.service';
import { firstValueFrom } from 'rxjs';
import { ServicoModel } from '../servico/model/servico.model';
import { LocalServicoModel } from '../local-servico/model/local-servico.model';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { LocalServicoService } from '../local-servico/service/local-servico.service';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent implements OnInit {

  avaliacaoTab: number = 0;
  servicosAguardandoAvaliacao: ServicoModel[] = [];
  servicosAvaliados: ServicoModel[] = [];
  servicosParaReavaliacao: ServicoModel[] = [];
  listaLocalServico: LocalServicoModel[] = [];
  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  localServicoModel = new LocalServicoModel();
  cadastroLocalServico = new LocalServicoModel();
  construtoraSelecionada: ConstrutoraModel = new ConstrutoraModel();
  listaCentrosDeCustoFiltrados: CentroCustoModel[] = [];
  displayedColumns: string[] = ["avaliar", "taskType", "locationGroup", 'subGroup1', 'subGroup2'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  isCadastroLocalServico = true;
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

  constructor(
    private avaliacaoService: AvaliacaoService,
    private localServicoService: LocalServicoService,
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
  ) { }

  ngOnInit(): void {
    this.buscarServicosAguardandoAvaliacao();
    this.buscarLocais();
    this.buscarConstrutoras();
    this.buscarCentrosDeCusto();
    this.filtrarDados(); 
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
  
    if (this.filtroConstrutoraSelecionado) {
      this.listaCentrosDeCustoFiltradaConsulta = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.builderName === this.filtroConstrutoraSelecionado);
      this.listaLocalServicoFiltrada = this.listaLocalServico.filter(localServico => localServico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      this.servicosAguardandoAvaliacao = this.servicosAguardandoAvaliacao.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
    } else {
      this.listaLocalServicoFiltrada = [...this.listaLocalServico];
    }
  
    if (this.filtroCentroCustoSelecionado) {
      this.servicosAguardandoAvaliacao = this.servicosAguardandoAvaliacao.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
    }

    if (this.filtroLocationGroup) {
      this.servicosAguardandoAvaliacao = this.servicosAguardandoAvaliacao.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);
    }

    if (this.filtroSubGroup1) {
      this.servicosAguardandoAvaliacao = this.servicosAguardandoAvaliacao.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
    }

    if (this.filtroSubGroup2) {
      this.servicosAguardandoAvaliacao = this.servicosAguardandoAvaliacao.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
    }
  }

  onConstrutoraChange() {
    this.listaCentrosDeCustoFiltrados = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.id === this.construtoraSelecionada.id);
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
    this.filtrarDados();
  }

  onFiltroCostCenterChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroCentroCustoSelecionado = null;
    } else {
      this.filtroCentroCustoSelecionado = novoFiltro;
    }
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
    this.filtrarDados();
  }

  mudarAba(posicao: number) {
    this.avaliacaoTab = posicao;
    if (posicao === 0) {
      this.buscarServicosAguardandoAvaliacao();
    } else if (posicao === 1) {
      this.buscarServicosParaReavaliacao();
    } else if (posicao === 2) {
      this.buscarServicosAvaliados();
    }
  }

  async buscarServicosAguardandoAvaliacao() {
    try {
      const servicos: any = await firstValueFrom(this.avaliacaoService.buscarServicosAguardandoAvaliacao());
      this.servicosAguardandoAvaliacao = servicos;
      this.filtrarDados();
    } catch (error) {
        console.error(error);
    }
  }

  async buscarServicosAvaliados() {
    this.servicosAvaliados = await firstValueFrom(this.avaliacaoService.buscarServicosAvaliados());
  }

  async buscarServicosParaReavaliacao() {
    this.servicosParaReavaliacao = await firstValueFrom(this.avaliacaoService.buscarServicosParaReavaliacao());
  }

}
