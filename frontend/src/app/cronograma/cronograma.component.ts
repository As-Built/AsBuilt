import { Component, OnInit } from '@angular/core';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { firstValueFrom } from 'rxjs';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicoService } from '../servico/service/servico.service';
import { ServicoModel } from '../servico/model/servico.model';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent implements OnInit {

  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  listaServicos: ServicoModel[] = [];
  listaServicosFiltrada: ServicoModel[] = [];
  listaConstrutorasConsulta: ConstrutoraModel[] = [];
  filtroConstrutoraSelecionado: string | null = null;
  filtroCentroCustoSelecionado: string | null = null;
  listaCentrosDeCustoFiltrados: CentroCustoModel[] = [];
  listaCentrosDeCustoFiltradaConsulta: CentroCustoModel[] = [];
  construtoraSelecionada: ConstrutoraModel = new ConstrutoraModel();

  constructor(
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
    private servicoService: ServicoService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buscarServicos();
    this.buscarConstrutoras();
    this.buscarCentrosDeCusto();
    this.filtrarDados();
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

  async buscarServicos() {
    this.spinner.show();
    try {
      const servicos: any = await firstValueFrom(this.servicoService.listarServicos());
      this.listaServicos = servicos;
      this.listaServicosFiltrada = this.listaServicos;
      this.filtrarDados();
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  filtrarDados() {
    const construtoras = this.listaServicos.map(item => item.costCenter.builder);
    const uniqueConstrutoras: { [key: string]: any } = {}; //Adiciona um index a consulta para não trazer valores repetidos
    construtoras.forEach(c => {
      uniqueConstrutoras[c.builderName] = c;
    });
    this.listaConstrutorasConsulta = Object.values(uniqueConstrutoras);
    this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora =>
      this.listaServicos.some(servico => servico.costCenter.builder.builderName === construtora.builderName
      )
    );

    if (this.filtroConstrutoraSelecionado) {
      this.listaCentrosDeCustoFiltradaConsulta = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.builderName === this.filtroConstrutoraSelecionado);
      this.listaServicosFiltrada = this.listaServicos.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
    }

    if (this.filtroCentroCustoSelecionado) {
      this.listaServicosFiltrada = this.listaServicos.filter(servico => servico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
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
    this.filtrarDados();
  }

  onFiltroCostCenterChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroCentroCustoSelecionado = null;
    } else {
      this.filtroCentroCustoSelecionado = novoFiltro;
    }
    this.filtrarDados();
  }

}
