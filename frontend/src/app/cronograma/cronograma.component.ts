import { Component, OnInit } from '@angular/core';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { firstValueFrom } from 'rxjs';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicoService } from '../servico/service/servico.service';
import { ServicoModel } from '../servico/model/servico.model';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { formatDate } from '@angular/common';
import 'chartjs-adapter-date-fns';

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

  public lineChartData: ChartDataset[] = [
    { data: [], label: 'Start Dates' }
  ];
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            day: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Término Esperada'
        }
      },
      y: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            day: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Início Esperada'
        },
        ticks: {
          callback: function (value) {
            return new Date(value).toLocaleDateString('pt-BR');
          }
        }
      }
    }
  };
  public lineChartColors: any[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

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
    const uniqueConstrutoras: { [key: string]: any } = {};
    construtoras.forEach(c => {
      uniqueConstrutoras[c.builderName] = c;
    });
    this.listaConstrutorasConsulta = Object.values(uniqueConstrutoras);
    this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora =>
      this.listaServicos.some(servico => servico.costCenter.builder.builderName === construtora.builderName)
    );

    if (this.filtroConstrutoraSelecionado) {
      this.listaCentrosDeCustoFiltradaConsulta = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.builderName === this.filtroConstrutoraSelecionado);
      this.listaServicosFiltrada = this.listaServicos.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
    }

    if (this.filtroCentroCustoSelecionado) {
      this.listaServicosFiltrada = this.listaServicos.filter(servico => servico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
    }
    this.populateChartData();
  }

  onConstrutoraChange() {
    this.listaCentrosDeCustoFiltrados = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.id === this.construtoraSelecionada.id);
  }

  onFiltroConstrutoraChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    this.filtroConstrutoraSelecionado = novoFiltro === 'Todos' ? null : novoFiltro;
    this.filtroCentroCustoSelecionado = null;
    this.filtrarDados();
  }

  onFiltroCostCenterChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    this.filtroCentroCustoSelecionado = novoFiltro === 'Todos' ? null : novoFiltro;
    this.filtrarDados();
  }

  populateChartData() {
    this.lineChartLabels = [];
    if (this.lineChartData[0]) {
      this.lineChartData[0].data = [];
    }
    this.lineChartType = 'line';
  
    const startDates = this.listaServicosFiltrada.map(servico => new Date(servico.expectedStartDate).getTime());
    const endDates = this.listaServicosFiltrada.map(servico => new Date(servico.expectedEndDate).getTime());
  
    const minStartDate = Math.min(...startDates);
    const maxEndDate = Math.max(...endDates);
  
    // Ajustar as datas mínima e máxima
    const adjustedMinStartDate = new Date(minStartDate);
    adjustedMinStartDate.setDate(adjustedMinStartDate.getDate() - 1);
  
    const adjustedMaxEndDate = new Date(maxEndDate);
    adjustedMaxEndDate.setDate(adjustedMaxEndDate.getDate() + 1);
  
    if (this.lineChartOptions.scales?.['x'] && this.lineChartOptions.scales?.['y']) {
      this.lineChartOptions.scales['x'].min = adjustedMinStartDate.getTime();
      this.lineChartOptions.scales['x'].max = adjustedMaxEndDate.getTime();
      this.lineChartOptions.scales['y'].min = adjustedMinStartDate.getTime();
      this.lineChartOptions.scales['y'].max = adjustedMaxEndDate.getTime();
    }
  
    this.listaServicosFiltrada.forEach(servico => {
      this.lineChartLabels.push(formatDate(servico.expectedEndDate, "dd/MM/yyyy", "pt-BR").toString());
      if (this.lineChartData[0]) {
        this.lineChartData[0].data.push({
          x: new Date(servico.expectedEndDate).getTime(),
          y: new Date(servico.expectedStartDate).getTime()
        });
      }
    });
  }
}