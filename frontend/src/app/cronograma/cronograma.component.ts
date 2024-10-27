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
import { getISOWeek } from 'date-fns';

function getWeekLabel(date: Date): string {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInDays = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffInDays / 7) + 1;
  return `Semana ${weekNumber}`;
}

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
    { data: [], label: 'Cronograma Inicial' }
  ];
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            week: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Início Prevista'
        },
        ticks: {
          callback: function (value, index, values) {
            const date = new Date(value as number);
            return getWeekLabel(date); // Use a função para formatar a label
          }
        }
      },
      y: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            week: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Término Prevista'
        },
        ticks: {
          callback: function (value) {
            const date = new Date(value as number);
            return getWeekLabel(date); // Use a função para formatar a label
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const raw = context.raw as { x: number, y: number }; // Asserção de tipo
            const startDate = new Date(raw.x);
            const endDate = new Date(raw.y);
            return `Início: ${startDate.toLocaleDateString('pt-BR')}, Término: ${endDate.toLocaleDateString('pt-BR')}`;
          }
        }
      }
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7
      }
    }
  };

  public secondLineChartData: ChartDataset[] = [
    { data: [], label: 'Cronograma Real', }
  ];
  public secondLineChartLabels: string[] = [];
  public secondLineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            week: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Início Real'
        },
        ticks: {
          callback: function (value, index, values) {
            const date = new Date(value as number);
            return getWeekLabel(date); // Use a função para formatar a label
          }
        }
      },
      y: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            week: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Término Real'
        },
        ticks: {
          callback: function (value) {
            const date = new Date(value as number);
            return getWeekLabel(date); // Use a função para formatar a label
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const raw = context.raw as { x: number, y: number }; // Asserção de tipo
            const startDate = new Date(raw.x);
            const endDate = new Date(raw.y);
            return `Início: ${startDate.toLocaleDateString('pt-BR')}, Término: ${endDate.toLocaleDateString('pt-BR')}`;
          }
        }
      }
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7
      }
    }
  };

  public thirdLineChartData: ChartDataset[] = [
    { data: [], label: 'Previsão Inicial', borderColor: 'blue', fill: false },
    { data: [], label: 'Real', borderColor: 'green', fill: false },
    { data: [], label: 'Previsão Ajustada', borderColor: 'red', fill: false }
  ];

  public thirdLineChartLabels: string[] = [];
  public thirdLineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            week: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Início'
        },
        ticks: {
          callback: function (value, index, values) {
            const date = new Date(value as number);
            return getWeekLabel(date); // Use a função para formatar a label
          }
        }
      },
      y: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            week: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Data de Término'
        },
        ticks: {
          callback: function (value) {
            const date = new Date(value as number);
            return getWeekLabel(date); // Use a função para formatar a label
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const raw = context.raw as { x: number, y: number }; // Asserção de tipo
            const startDate = new Date(raw.x);
            const endDate = new Date(raw.y);
            return `Início: ${startDate.toLocaleDateString('pt-BR')}, Término: ${endDate.toLocaleDateString('pt-BR')}`;
          }
        }
      }
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7
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
  public secondLineChartLegend = true;
  public secondLineChartType: ChartType = 'line';
  public thirdLineChartLegend = true;
  public thirdLineChartType: ChartType = 'line';

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
      const construtoras: ConstrutoraModel[] = await firstValueFrom(this.construtoraService.listarConstrutoras());
      this.listaConstrutoras = construtoras;
    } catch (error) {
      console.error(error);
    }
  }

  async buscarCentrosDeCusto() {
    try {
      const centros: CentroCustoModel[] = await firstValueFrom(this.centroCustoService.listarCentrosDeCusto());
      this.listaCentrosDeCusto = centros;
    } catch (error) {
      console.error(error);
    }
  }

  async buscarServicos() {
    this.spinner.show();
    try {
      const servicos: ServicoModel[] = await firstValueFrom(this.servicoService.listarServicos());
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
    const uniqueConstrutoras: { [key: string]: ConstrutoraModel } = {};
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
    this.populateSecondChartData();
    this.populateThirdChartData();
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

  agruparServicosPorTipo(): { [key: string]: ServicoModel[] } {
    return this.listaServicosFiltrada.reduce((acc, servico) => {
      const tipo = servico.taskType.taskTypeName;
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(servico);
      return acc;
    }, {} as { [key: string]: ServicoModel[] });
  }

  populateChartData() {
    this.lineChartLabels = [];
    this.lineChartData = [
      { data: [], label: 'Previsão inicial da obra' }
    ];

    const startDates = this.listaServicosFiltrada.map(servico => new Date(servico.expectedStartDate).getTime());
    const endDates = this.listaServicosFiltrada.map(servico => new Date(servico.expectedEndDate).getTime());

    const minStartDate = Math.min(...startDates);
    const maxEndDate = Math.max(...endDates);

    // Ajustar as datas mínima e máxima
    const adjustedMinStartDate = new Date(minStartDate);
    adjustedMinStartDate.setDate(adjustedMinStartDate.getDate() - 8);  // Subtrai uma semana (7 dias) + 1 dia extra a exibição do gráfico

    const adjustedMaxEndDate = new Date(maxEndDate);
    adjustedMaxEndDate.setDate(adjustedMaxEndDate.getDate() + 8);  // Adiciona uma semana (7 dias) + 1 dia extra a exibição do gráfico

    if (this.lineChartOptions.scales?.['x'] && this.lineChartOptions.scales?.['y']) {
      this.lineChartOptions.scales['x'].min = adjustedMinStartDate.getTime();
      this.lineChartOptions.scales['x'].max = adjustedMaxEndDate.getTime();
      this.lineChartOptions.scales['y'].min = adjustedMinStartDate.getTime();
      this.lineChartOptions.scales['y'].max = adjustedMaxEndDate.getTime();
    }

    const servicosPorTipo = this.agruparServicosPorTipo();

    const cores = [
      'rgba(255, 99, 132, 0.2)', // Vermelho
      'rgba(54, 162, 235, 0.2)', // Azul
      'rgba(255, 206, 86, 0.2)', // Amarelo
      'rgba(75, 192, 192, 0.2)', // Verde
      'rgba(153, 102, 255, 0.2)', // Roxo
      'rgba(255, 159, 64, 0.2)'  // Laranja
    ];

    const borderColors = [
      'rgba(255, 99, 132, 1)', // Vermelho
      'rgba(54, 162, 235, 1)', // Azul
      'rgba(255, 206, 86, 1)', // Amarelo
      'rgba(75, 192, 192, 1)', // Verde
      'rgba(153, 102, 255, 1)', // Roxo
      'rgba(255, 159, 64, 1)'  // Laranja
    ];

    let colorIndex = 0;

    for (const tipo in servicosPorTipo) {
      const data = servicosPorTipo[tipo].map(servico => ({
        x: new Date(servico.expectedStartDate).getTime(),
        y: new Date(servico.expectedEndDate).getTime()
      }));

      this.lineChartData.push({
        data,
        label: `C.I. ${tipo}`, // Adiciona "C.I." antes do nome do serviço
        backgroundColor: cores[colorIndex % cores.length],
        borderColor: borderColors[colorIndex % borderColors.length],
        borderWidth: 1,
        pointBackgroundColor: borderColors[colorIndex % borderColors.length], // Cor do ponto
        pointBorderColor: borderColors[colorIndex % borderColors.length] // Cor da borda do ponto
      });

      colorIndex++;
    }

    this.listaServicosFiltrada.forEach(servico => {
      this.lineChartLabels.push(formatDate(servico.expectedStartDate, "dd/MM/yyyy", "pt-BR").toString());
      if (this.lineChartData[0]) {
        this.lineChartData[0].data.push({
          x: new Date(servico.expectedStartDate).getTime(),
          y: new Date(servico.expectedEndDate).getTime()
        });
      }
    });
  }

  agruparServicosComDataPorTipo(): { [key: string]: ServicoModel[] } {
    const filteredServicos = this.listaServicosFiltrada.filter(servico => servico.startDate && servico.finalDate); //Filtra serviços que possuem data de início e término
    return filteredServicos.reduce((acc, servico) => {
      const tipo = servico.taskType.taskTypeName;
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(servico);
      return acc;
    }, {} as { [key: string]: ServicoModel[] });
  }

  populateSecondChartData() {
    this.secondLineChartLabels = [];
    this.secondLineChartData = [
      { data: [], label: 'Cronograma real da obra' }
    ];

    const filteredServicos = this.listaServicosFiltrada.filter(servico => servico.startDate && servico.finalDate); //Filtra serviços que possuem data de início e término

    const startDates = filteredServicos.map(servico => new Date(servico.startDate!).getTime());
    const endDates = filteredServicos.map(servico => new Date(servico.finalDate!).getTime());

    const minStartDate = Math.min(...startDates);
    const maxEndDate = Math.max(...endDates);

    // Ajustar as datas mínima e máxima
    const adjustedMinStartDate = new Date(minStartDate);
    adjustedMinStartDate.setDate(adjustedMinStartDate.getDate() - 8); // Subtrai uma semana (7 dias) + 1 dia extra a exibição do gráfico

    const adjustedMaxEndDate = new Date(maxEndDate);
    adjustedMaxEndDate.setDate(adjustedMaxEndDate.getDate() + 8); // Adiciona uma semana (7 dias) + 1 dia extra a exibição do gráfico

    if (this.secondLineChartOptions.scales?.['x'] && this.secondLineChartOptions.scales?.['y']) {
      this.secondLineChartOptions.scales['x'].min = adjustedMinStartDate.getTime();
      this.secondLineChartOptions.scales['x'].max = adjustedMaxEndDate.getTime();
      this.secondLineChartOptions.scales['y'].min = adjustedMinStartDate.getTime();
      this.secondLineChartOptions.scales['y'].max = adjustedMaxEndDate.getTime();
    }

    const servicosPorTipo = this.agruparServicosComDataPorTipo();

    const cores = [
      'rgba(255, 99, 132, 0.2)', // Vermelho
      'rgba(54, 162, 235, 0.2)', // Azul
      'rgba(255, 206, 86, 0.2)', // Amarelo
      'rgba(75, 192, 192, 0.2)', // Verde
      'rgba(153, 102, 255, 0.2)', // Roxo
      'rgba(255, 159, 64, 0.2)'  // Laranja
    ];

    const borderColors = [
      'rgba(255, 99, 132, 1)', // Vermelho
      'rgba(54, 162, 235, 1)', // Azul
      'rgba(255, 206, 86, 1)', // Amarelo
      'rgba(75, 192, 192, 1)', // Verde
      'rgba(153, 102, 255, 1)', // Roxo
      'rgba(255, 159, 64, 1)'  // Laranja
    ];

    let colorIndex = 0;

    for (const tipo in servicosPorTipo) {
      const data = servicosPorTipo[tipo].map(servico => ({
        x: new Date(servico.startDate!).getTime(),
        y: new Date(servico.finalDate!).getTime()
      }));

      this.secondLineChartData.push({
        data,
        label: `C.R. ${tipo}`, // Adiciona "C.R." antes do nome do serviço
        backgroundColor: cores[colorIndex % cores.length],
        borderColor: borderColors[colorIndex % borderColors.length],
        borderWidth: 1,
        pointBackgroundColor: borderColors[colorIndex % borderColors.length], // Cor do ponto
        pointBorderColor: borderColors[colorIndex % borderColors.length] // Cor da borda do ponto
      });

      colorIndex++;
    }

    filteredServicos.forEach(servico => {
      this.secondLineChartLabels.push(formatDate(servico.startDate!, "dd/MM/yyyy", "pt-BR").toString());
      if (this.secondLineChartData[0]) {
        this.secondLineChartData[0].data.push({
          x: new Date(servico.startDate!).getTime(),
          y: new Date(servico.finalDate!).getTime()
        });
      }
    });
  }

  populateThirdChartData() {
    const allServicos = this.listaServicosFiltrada;
  
    let totalEndDateDifference = 0;
    let totalStartDateDifference = 0;
    let count = 0;
  
    const startDates: number[] = [];
    const endDates: number[] = [];
  
    // Limpa os dados existentes
    this.thirdLineChartData[0].data = [];
    this.thirdLineChartData[1].data = [];
    this.thirdLineChartData[2].data = [];
    this.thirdLineChartLabels = [];
  
    allServicos.forEach(servico => {
      const expectedStartDate = new Date(servico.expectedStartDate).getTime();
      const expectedEndDate = new Date(servico.expectedEndDate).getTime();
      const realStartDate = servico.startDate ? new Date(servico.startDate).getTime() : null;
      const realEndDate = servico.finalDate ? new Date(servico.finalDate).getTime() : null;
  
      // Adiciona dados de previsão inicial
      this.thirdLineChartData[0].data.push({
        x: expectedStartDate,
        y: expectedEndDate
      });
  
      // Adiciona labels
      this.thirdLineChartLabels.push(getWeekLabel(new Date(servico.expectedStartDate)));
  
      // Coleta datas para ajustar as escalas
      startDates.push(expectedStartDate);
      endDates.push(expectedEndDate);
  
      if (realStartDate && realEndDate) {
        // Calcula a diferença entre datas previstas e reais
        const endDateDifference = realEndDate - expectedEndDate;
        const startDateDifference = realStartDate - expectedStartDate;
        totalEndDateDifference += endDateDifference;
        totalStartDateDifference += startDateDifference;
        count++;
  
        // Adiciona dados reais
        this.thirdLineChartData[1].data.push({
          x: realStartDate,
          y: realEndDate
        });
  
        // Coleta datas reais para ajustar as escalas
        startDates.push(realStartDate);
        endDates.push(realEndDate);
      }
    });
  
    const averageEndDateDifference = totalEndDateDifference / count;
    const averageStartDateDifference = totalStartDateDifference / count;
  
    // Adiciona dados de previsão ajustada
    allServicos.forEach(servico => {
      const expectedStartDate = new Date(servico.expectedStartDate).getTime();
      const expectedEndDate = new Date(servico.expectedEndDate).getTime();
      const realStartDate = servico.startDate ? new Date(servico.startDate).getTime() : null;
      const realEndDate = servico.finalDate ? new Date(servico.finalDate).getTime() : null;
  
      const adjustedStartDate = realStartDate ? realStartDate : expectedStartDate + averageStartDateDifference;
      const adjustedEndDate = realEndDate ? realEndDate : expectedEndDate + averageEndDateDifference;
  
      this.thirdLineChartData[2].data.push({
        x: adjustedStartDate,
        y: adjustedEndDate
      });
    });
  
    // Ajusta as escalas dos eixos X e Y
    const minStartDate = Math.min(...startDates);
    const maxEndDate = Math.max(...endDates);
  
    const adjustedMinStartDate = new Date(minStartDate);
    adjustedMinStartDate.setDate(adjustedMinStartDate.getDate() - 8);// Subtrai uma semana (7 dias) + 1 dia extra
  
    const adjustedMaxEndDate = new Date(maxEndDate);
    adjustedMaxEndDate.setDate(adjustedMaxEndDate.getDate() + 8); // Adiciona uma semana (7 dias) + 1 dia extra
  
    if (this.thirdLineChartOptions.scales?.['x'] && this.thirdLineChartOptions.scales?.['y']) {
      this.thirdLineChartOptions.scales['x'].min = adjustedMinStartDate.getTime();
      this.thirdLineChartOptions.scales['x'].max = adjustedMaxEndDate.getTime();
      this.thirdLineChartOptions.scales['y'].min = adjustedMinStartDate.getTime();
      this.thirdLineChartOptions.scales['y'].max = adjustedMaxEndDate.getTime();
    }
  }
}