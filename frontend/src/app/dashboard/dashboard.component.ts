import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { ValorProducaoService } from '../shared/service/valor-producao.service';
import { ValorProducaoModel } from '../shared/model/valor-producao.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { ChartOptions, ChartType, ChartDataset, Chart } from 'chart.js';
import { SalarioService } from '../shared/service/salario.service';
import { LanguageSelectorService } from '../shared/language-selector/service/language-selector.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {

  userName: string = "";
  userId: number = 0;
  isAdmin: boolean = false;
  isConferente: boolean = false;
  isFuncionario: boolean = false;
  producaoDoMesPorUsuario: ValorProducaoModel[] = [];
  producaoTotalPorUsuario: ValorProducaoModel[] = [];
  totalServicosNoMes: number = 0;
  totalAprovacoesNoMes: number = 0;
  totalReprovacoesNoMes: number = 0;
  mediaAprovacaoTotalNoMes: number = 0;
  remuneracaoTotalNoMes: number = 0;
  valorTotalProduzidoNoMes: number = 0;
  producaoTotalEfetivaNoMes: number = 0;
  producaoTotalDoMes: ValorProducaoModel[] = [];
  producaoTotal: ValorProducaoModel[] = [];
  servicosNoMesPorUsuario: number = 0;
  aprovacoesNoMesPorUsuario: number = 0;
  reprovacoesNoMesPorUsuario: number = 0;
  mediaAprovacaoNoMesPorUsuario: number = 0;
  totalReprovacoesNoMesPorUsuario: number = 0;
  remuneracaoAtual: number = 0;
  valorProduzidoNoMes: number = 0;
  producaoEfetivaNoMes: number = 0;
  totalServicosExecutados: number = 0;
  totalAprovacoesPorUsuario: number = 0;
  totalReprovacoesPorUsuario: number = 0;
  totalAprovacoes: number = 0;
  totalReprovacoes: number = 0;
  public lineChartData: ChartDataset[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        title: {
          display: true,
          text: 'Meses do Ano'
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        },
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.raw;
            return `${datasetLabel}: ${value}`;
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
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public anoAtual: number = new Date().getFullYear();

  constructor(private router: Router,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private valorProducaoService: ValorProducaoService,
    private cdr: ChangeDetectorRef,
    private salarioService: SalarioService,
    private localeService: LanguageSelectorService,
    private translate: TranslateService
  ) {
    this.translate.get([
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
      'MONTHS_OF_YEAR', 'QUANTITY'
    ]).subscribe(translations => {
      this.lineChartOptions = {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            labels: [
              translations['JANUARY'], translations['FEBRUARY'], translations['MARCH'], translations['APRIL'],
              translations['MAY'], translations['JUNE'], translations['JULY'], translations['AUGUST'],
              translations['SEPTEMBER'], translations['OCTOBER'], translations['NOVEMBER'], translations['DECEMBER']
            ],
            title: {
              display: true,
              text: translations['MONTHS_OF_YEAR']
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: translations['QUANTITY']
            },
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const datasetLabel = context.dataset.label || '';
                const value = context.raw;
                return `${datasetLabel}: ${value}`;
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
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.getUserFromToken();
    if (this.isAdmin || this.isConferente) {
      await this.buscarValorProducaoTotalPorMes();
    }
    else if (this.isFuncionario) {
      await this.buscarValorProducaoPorMesPorUsuario();
    }

    await this.buscarValorProducaoTotal();
    this.spinner.hide();
  }

  private getUserFromToken() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token!) as any;
    const userRole = decodedToken.user.roles;
    this.userName = decodedToken.user.name;
    this.userId = decodedToken.user.id;
    this.isAdmin = userRole.includes('ADMIN');
    this.isConferente = userRole.includes('CONFERENTE');
    this.isFuncionario = userRole.includes('FUNCIONARIO');
  }

  async buscarValorProducaoPorMesPorUsuario() {
    try {
      let mesAtual = new Date().getMonth() + 1; // Os meses são indexados de 0 a 11 com o getMonth
      const producaoNoMes = await firstValueFrom(this.valorProducaoService.buscarValorProducaoPorMesPorUsuario(mesAtual, this.userId));
      this.producaoDoMesPorUsuario = producaoNoMes;
      this.cdr.detectChanges(); // Renderiza o gráfico após a busca dos dados
    } catch (error) {
      console.error(error);
    }
    this.contabilizarProducaoDoMesUsuario();
  }

  async buscarValorProducaoTotalPorMes() {
    try {
      let mesAtual = new Date().getMonth() + 1; // Os meses são indexados de 0 a 11 com o getMonth
      const producaoNoMes = await firstValueFrom(this.valorProducaoService.buscarValorProducaoTotalPorMes(mesAtual));
      this.producaoTotalDoMes = producaoNoMes;
      this.cdr.detectChanges(); // Renderiza o gráfico após a busca dos dados
    } catch (error) {
      console.error(error);
    }
    this.contabilizarProducaoTotalDoMes();
  }

  async buscarValorProducaoTotal() {
    try {
      if (this.isAdmin || this.isConferente) {
        const producaoTotal = await firstValueFrom(this.valorProducaoService.buscarValorProducaoTotal());
        this.producaoTotal = producaoTotal;
        this.cdr.detectChanges(); // Renderiza o gráfico após a busca dos dados
      }
      else
        if (this.isFuncionario) {
          const producaoTotal = await firstValueFrom(this.valorProducaoService.buscarValorProducaoTotalPorUsuario(this.userId));
          this.producaoTotalPorUsuario = producaoTotal;
          this.cdr.detectChanges(); // Renderiza o gráfico após a busca dos dados
        }
    } catch (error) {
      console.error(error);
    }
    if (this.isAdmin || this.isConferente) {
      this.contabilizarProducaoTotal();
    }
    if (this.isFuncionario) {
      this.contabilizarProducaoTotalUsuario();
    }
  }

  async buscarSomaUltimosSalarios() {
    try {
      const somaSalarios = await firstValueFrom(this.salarioService.buscarSomaUltimosSalarios());
      this.remuneracaoTotalNoMes = somaSalarios;
    } catch (error) {
      console.error(error);
    }
  }

  async contabilizarProducaoDoMesUsuario() {
    this.servicosNoMesPorUsuario = this.producaoDoMesPorUsuario.length;
    this.aprovacoesNoMesPorUsuario = this.producaoDoMesPorUsuario.filter((producao) => producao.assessment.assessmentResult == true).length;
    this.reprovacoesNoMesPorUsuario = this.producaoDoMesPorUsuario.filter((producao) => producao.assessment.assessmentResult == false).length;
    this.mediaAprovacaoNoMesPorUsuario = (this.aprovacoesNoMesPorUsuario / this.servicosNoMesPorUsuario) * 100;
    let ultimoSalario: any;
    if (this.producaoDoMesPorUsuario[0].user !== null || this.producaoDoMesPorUsuario[0].user !== undefined) {
      if (this.producaoDoMesPorUsuario[0].user.salaries !== null || this.producaoDoMesPorUsuario[0].user.salaries !== undefined) {
        ultimoSalario = this.producaoDoMesPorUsuario[0].user.salaries![0];
      }
      else {
        ultimoSalario = { value: 0, updateDate: new Date() };
      }
    }
    else {
      ultimoSalario = { value: 0, updateDate: new Date() };
    }

    this.producaoDoMesPorUsuario.forEach((producao) => {
      this.remuneracaoTotalNoMes += producao.value;
      if (producao.user.salaries) {
        producao.user.salaries.forEach((salario) => {
          if (salario.updateDate > ultimoSalario.updateDate) {
            this.remuneracaoAtual = salario.value;
            ultimoSalario = salario;
          }
          else {
            this.remuneracaoAtual = ultimoSalario.value;
          }
        });
      }
      this.valorProduzidoNoMes += producao.value;
    });
    this.producaoEfetivaNoMes = this.valorProduzidoNoMes - this.remuneracaoAtual;
    this.popularGraficoPizzaDesempenhoDoMesUsuario();
  }

  async contabilizarProducaoTotalDoMes() {
    this.totalServicosNoMes = this.producaoTotalDoMes.length;
    this.totalAprovacoesNoMes = this.producaoTotalDoMes.filter((producao) => producao.assessment.assessmentResult == true).length;
    this.totalReprovacoesNoMes = this.producaoTotalDoMes.filter((producao) => producao.assessment.assessmentResult == false).length;
    this.mediaAprovacaoTotalNoMes = (this.totalAprovacoesNoMes / this.totalServicosNoMes) * 100;
    await this.buscarSomaUltimosSalarios();
    this.valorTotalProduzidoNoMes = 0;

    this.producaoTotalDoMes.forEach((producao) => { // Busca o último salário de cada usuário da produção para o mês corrente
      this.valorTotalProduzidoNoMes += producao.value;
    });

    this.producaoTotalEfetivaNoMes = this.valorTotalProduzidoNoMes - this.remuneracaoTotalNoMes;
    this.popularGraficoPizzaDesempenhoDoMes();
  }

  async contabilizarProducaoTotalUsuario() {
    this.totalServicosExecutados = this.producaoTotalPorUsuario.length;
    this.totalAprovacoesPorUsuario = this.producaoTotalPorUsuario.filter((producao) => producao.assessment.assessmentResult == true).length;
    this.totalReprovacoesPorUsuario = this.producaoTotalPorUsuario.filter((producao) => producao.assessment.assessmentResult == false).length;
    this.popularGraficoPizzaDesempenhoTotalUsuario();
  }

  async contabilizarProducaoTotal() {
    this.totalServicosExecutados = this.producaoTotal.length;
    this.totalAprovacoes = this.producaoTotal.filter((producao) => producao.assessment.assessmentResult == true).length;
    this.totalReprovacoes = this.producaoTotal.filter((producao) => producao.assessment.assessmentResult == false).length;
    this.popularGraficoPizzaDesempenhoTotal();
  }

  popularGraficoPizzaDesempenhoDoMes(): void {
    const ctx = document.getElementById('graficoPizzaDesempenhoDoMes') as HTMLCanvasElement;
    this.translate.get(['APPROVALS', 'REJECTIONS']).subscribe(translations => {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [translations['APPROVALS'], translations['REJECTIONS']],
          datasets: [{
            data: [this.totalAprovacoesNoMes, this.totalReprovacoesNoMes],
            backgroundColor: ['#36A2EB', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    });
  }

  popularGraficoPizzaDesempenhoDoMesUsuario(): void {
    const ctx = document.getElementById('graficoPizzaDesempenhoDoMesUsuario') as HTMLCanvasElement;
    this.translate.get(['APPROVALS', 'REJECTIONS']).subscribe(translations => {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [translations['APPROVALS'], translations['REJECTIONS']],
          datasets: [{
            data: [this.aprovacoesNoMesPorUsuario, this.reprovacoesNoMesPorUsuario],
            backgroundColor: ['#36A2EB', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    });
  }

  popularGraficoPizzaDesempenhoTotalUsuario(): void {
    const ctx = document.getElementById('graficoPizzaDesempenhoTotalFuncionario') as HTMLCanvasElement;
    this.translate.get(['APPROVALS', 'REJECTIONS']).subscribe(translations => {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [translations['APPROVALS'], translations['REJECTIONS']],
          datasets: [{
            data: [this.totalAprovacoesPorUsuario, this.totalReprovacoesPorUsuario],
            backgroundColor: ['#36A2EB', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    });
    this.popularGraficoLinhaDesempenhoGeralUsuario();
  }

  popularGraficoPizzaDesempenhoTotal(): void {
    const ctx = document.getElementById('graficoPizzaDesempenhoTotal') as HTMLCanvasElement;
    this.translate.get(['APPROVALS', 'REJECTIONS']).subscribe(translations => {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [translations['APPROVALS'], translations['REJECTIONS']],
          datasets: [{
            data: [this.totalAprovacoes, this.totalReprovacoes],
            backgroundColor: ['#36A2EB', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    });
    this.popularGraficoLinhaDesempenhoGeral();
  }

  popularGraficoLinhaDesempenhoGeralUsuario() {
    this.lineChartLabels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const servicosPorMes = new Array(12).fill(0);
    const aprovacoesPorMes = new Array(12).fill(0);
    const reprovacoesPorMes = new Array(12).fill(0);

    this.producaoTotalPorUsuario.forEach(producao => {
      const mes = new Date(producao.date).getMonth();
      servicosPorMes[mes]++;
      if (producao.assessment.assessmentResult) {
        aprovacoesPorMes[mes]++;
      } else {
        reprovacoesPorMes[mes]++;
      }
    });

    this.lineChartData = [
      {
        data: servicosPorMes,
        label: 'Total de Serviços Executados',
        backgroundColor: 'rgba(0, 0, 255)',
        borderColor: 'rgba(0, 0, 255)',
        pointBackgroundColor: 'rgba(0, 0, 255)',
        pointBorderColor: 'rgba(0, 0, 255)',
        borderWidth: 1
      },
      {
        data: aprovacoesPorMes,
        label: 'Total de Aprovações',
        backgroundColor: 'rgba(41, 71, 0)',
        borderColor: 'rgba(71, 71, 0)',
        pointBackgroundColor: 'rgba(41, 71, 0)',
        pointBorderColor: 'rgba(71, 71, 0)',
        borderWidth: 1
      },
      {
        data: reprovacoesPorMes,
        label: 'Total de Reprovações',
        backgroundColor: 'rgba(255, 0, 0)',
        borderColor: 'rgba(255, 0, 0)',
        pointBackgroundColor: 'rgba(255, 0, 0)',
        pointBorderColor: 'rgba(255, 0, 0)',
        borderWidth: 1
      }
    ];
  }

  popularGraficoLinhaDesempenhoGeral(): void {
    this.translate.get([
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
      'TOTAL_SERVICES', 'TOTAL_APPROVALS', 'TOTAL_REJECTIONS'
    ]).subscribe(translations => {
      this.lineChartLabels = [
        translations['JANUARY'], translations['FEBRUARY'], translations['MARCH'], translations['APRIL'],
        translations['MAY'], translations['JUNE'], translations['JULY'], translations['AUGUST'],
        translations['SEPTEMBER'], translations['OCTOBER'], translations['NOVEMBER'], translations['DECEMBER']
      ];

      const servicosPorMes = new Array(12).fill(0);
      const aprovacoesPorMes = new Array(12).fill(0);
      const reprovacoesPorMes = new Array(12).fill(0);

      this.producaoTotal.forEach(producao => {
        const mes = new Date(producao.date).getMonth();
        servicosPorMes[mes]++;
        if (producao.assessment.assessmentResult) {
          aprovacoesPorMes[mes]++;
        } else {
          reprovacoesPorMes[mes]++;
        }
      });

      this.lineChartData = [
        {
          data: servicosPorMes,
          label: translations['TOTAL_SERVICES'],
          backgroundColor: 'rgba(0, 0, 255)',
          borderColor: 'rgba(0, 0, 255)',
          pointBackgroundColor: 'rgba(0, 0, 255)',
          pointBorderColor: 'rgba(0, 0, 255)',
          borderWidth: 1
        },
        {
          data: aprovacoesPorMes,
          label: translations['TOTAL_APPROVALS'],
          backgroundColor: 'rgba(41, 71, 0)',
          borderColor: 'rgba(71, 71, 0)',
          pointBackgroundColor: 'rgba(41, 71, 0)',
          pointBorderColor: 'rgba(41, 71, 0)',
          borderWidth: 1
        },
        {
          data: reprovacoesPorMes,
          label: translations['TOTAL_REJECTIONS'],
          backgroundColor: 'rgba(255, 0, 0)',
          borderColor: 'rgba(255, 0, 0)',
          pointBackgroundColor: 'rgba(255, 0, 0)',
          pointBorderColor: 'rgba(255, 0, 0)',
          borderWidth: 1
        }
      ];
    });
  }

  getCurrencyCode(): string {
    const locale = this.localeService.getLocale();
    return locale === 'pt-br' ? 'BRL' : 'USD';
  }
}