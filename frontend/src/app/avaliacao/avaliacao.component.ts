import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AvaliacaoService } from './service/avaliacao.service';
import { catchError, firstValueFrom, forkJoin, of, tap } from 'rxjs';
import { ServicoModel } from '../servico/model/servico.model';
import { LocalServicoModel } from '../local-servico/model/local-servico.model';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { LocalServicoService } from '../local-servico/service/local-servico.service';
import Swal from 'sweetalert2'
import { AvaliacaoModel } from './model/avaliacao.model';
import { formatDate } from '@angular/common';
import { UsuarioService } from '../usuario/service/usuario.service';
import { UsuarioModel } from '../usuario/model/usuario.model';
import { cloneDeep } from 'lodash';
import { ValorProducaoService } from '../shared/service/valor-producao.service';
import { ValorProducaoModel } from '../shared/model/valor-producao.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent implements OnInit {

  @ViewChild('modalAvaliacaoServico', { static: true })
  modalAvaliacaoServico!: ElementRef;

  @ViewChild('modalAnexarFotos', { static: true })
  modalAnexarFotos!: ElementRef;

  @ViewChild('modalVisualizarAvaliacaoConcluida', { static: true })
  modalVisualizarAvaliacaoConcluida!: ElementRef;

  @ViewChild('modalAvaliacoesRealizadasPorServico', { static: true })
  modalAvaliacoesRealizadasPorServico!: ElementRef;

  @ViewChild('filterTableConstrutora') 
  filterTableConstrutora!: ElementRef;

  avaliacaoTab: number = 0;
  servicosAguardandoAvaliacao: ServicoModel[] = [];
  servicosAguardandoAvaliacaoFiltrada: ServicoModel[] = [];
  servicosAvaliados: ServicoModel[] = [];
  servicosAvaliadosFiltrados: ServicoModel[] = [];
  servicosParaReavaliacao: ServicoModel[] = [];
  servicosParaReavaliacaoFiltrados: ServicoModel[] = [];
  listaLocalServico: LocalServicoModel[] = [];
  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  localServicoModel = new LocalServicoModel();
  cadastroLocalServico = new LocalServicoModel();
  construtoraSelecionada: ConstrutoraModel = new ConstrutoraModel();
  listaCentrosDeCustoFiltrados: CentroCustoModel[] = [];
  renderModalAvaliacaoServico = false;
  rendermodalVisualizarAvaliacaoConcluida = false;
  renderModalAnexarFotos = false;
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
  displayedColumns: string[] = [];
  servicoSelecionadoAvaliacao: ServicoModel = new ServicoModel();
  avaliacaoModel = new AvaliacaoModel();
  expectedStartDateFormatada: string = "";
  expectedEndDateFormatada: string = "";
  realStartDateFormatada: string = "";
  realEndDateFormatada: string | null = null;
  listaFuncionarios: UsuarioModel[] = [];
  listaConferentes: UsuarioModel[] = [];
  additionalExecutors: number[] = [];
  additionalEvaluators: number[] = [];
  msgErroValidacao: string = "";
  campoErroValidacao: string = "";
  fotosServico: string[] = [];
  fotosServicoBlob: Uint8Array[] = [];
  fileToUpload: File[] = [];
  fileIsLoading = false;
  isFileValid = false;
  dataAvalicaoFormatada: string | null = null;
  avaliacoesRealizadasPorServico: AvaliacaoModel[] = [];
  colunasAvaliacaoPorServico: string[] = ["visualizar", "dataAvaliacao", "resultado"];
  renderModalAvaliacoesRealizadasPorServico = false;
  executorPercentages: number[] = [];
  valorProducaoModel = new ValorProducaoModel();
  valoresProducao: ValorProducaoModel[] = [];
  currentLang: string = 'en';

  constructor(
    private avaliacaoService: AvaliacaoService,
    private localServicoService: LocalServicoService,
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
    private usuarioService: UsuarioService,
    private valorProducaoService: ValorProducaoService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.fotosServico = [];
    this.buscarServicosAguardandoAvaliacao();
    this.buscarLocais();
    this.buscarConstrutoras();
    this.buscarCentrosDeCusto();
    this.updateDisplayedColumnsBuilder();
    this.filtrarDados();
    this.listarFuncionarios();
    this.listarConferentes();
    this.executorPercentages[0] = 100;
  }

  updateDisplayedColumnsBuilder() {
    this.displayedColumns = this.filtroConstrutoraSelecionado == null
      ? ["avaliar", "builder", "costCenter", "taskType", "locationGroup", "subGroup1", "subGroup2"]
      : ["avaliar", "costCenter", "taskType", "locationGroup", "subGroup1", "subGroup2"];
  }

  updateDisplayedColumnsCostCenter() {
    this.displayedColumns = this.filtroCentroCustoSelecionado == null
      ? ["avaliar", "costCenter", "taskType", "locationGroup", "subGroup1", "subGroup2"]
      : ["avaliar", "taskType", "locationGroup", "subGroup1", "subGroup2"];
  }

  updateDisplayedColumnsLocationGroup() {
    this.displayedColumns = this.filtroCentroCustoSelecionado == null
      ? ["avaliar", "taskType", "locationGroup", "subGroup1", "subGroup2", "dimension", "unitMeasurement"]
      : ["avaliar", "taskType", "subGroup1", "subGroup2", "dimension", "unitMeasurement"];
  }

  updateDisplayedColumnsSubGroup1() {
    this.displayedColumns = this.filtroCentroCustoSelecionado == null
      ? ["avaliar", "taskType", "locationGroup", "subGroup1", "subGroup2", "dimension", "unitMeasurement"]
      : ["avaliar", "taskType", "subGroup2", "dimension", "unitMeasurement"];
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
    if (this.avaliacaoTab == 0) {
      this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora => 
        this.servicosAguardandoAvaliacao.some(servico => servico.costCenter.builder.builderName === construtora.builderName)
      );
    }
    if (this.avaliacaoTab == 1) {
      this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora => 
        this.servicosParaReavaliacao.some(servico => servico.costCenter.builder.builderName === construtora.builderName)
      );
    }
    if (this.avaliacaoTab == 2) {
      this.listaConstrutorasConsulta = this.listaConstrutorasConsulta.filter(construtora => 
        this.servicosAvaliados.some(servico => servico.costCenter.builder.builderName === construtora.builderName)
      );
    }

    if (this.filtroConstrutoraSelecionado) {
      this.listaCentrosDeCustoFiltradaConsulta = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.builderName === this.filtroConstrutoraSelecionado);
      this.listaLocalServicoFiltrada = this.listaLocalServico.filter(localServico => localServico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      if (this.avaliacaoTab == 0) {
        this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      }
      if (this.avaliacaoTab == 1) {
        this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      }
      if (this.avaliacaoTab == 2) {
        this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      }
    } else {
      this.listaLocalServicoFiltrada = [...this.listaLocalServico];
    }

    if (this.filtroCentroCustoSelecionado) {
      if (this.avaliacaoTab == 0) {
        this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
      }
      if (this.avaliacaoTab == 1) {
        this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
      }
      if (this.avaliacaoTab == 2) {
        this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
      }
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);

      const uniqueLocationGroups: { [key: string]: LocalServicoModel } = {}; //Adiciona um index a consulta para não trazer valores repetidos
      this.listaLocalServicoFiltrada.forEach(localServico => {
        uniqueLocationGroups[localServico.locationGroup] = localServico;
      });
      this.listaLocationGroupFiltradaConsulta = Object.values(uniqueLocationGroups)
      if (this.avaliacaoTab == 0) {
        this.listaLocationGroupFiltradaConsulta = this.listaLocationGroupFiltradaConsulta.filter(local => 
          this.servicosAguardandoAvaliacao.some(servico => servico.taskLocation.locationGroup === local.locationGroup)
        );
      }
      if (this.avaliacaoTab == 1) {
        this.listaLocationGroupFiltradaConsulta = this.listaLocationGroupFiltradaConsulta.filter(local => 
          this.servicosParaReavaliacao.some(servico => servico.taskLocation.locationGroup === local.locationGroup)
        );
      }
      if (this.avaliacaoTab == 2) {
        this.listaLocationGroupFiltradaConsulta = this.listaLocationGroupFiltradaConsulta.filter(local => 
          this.servicosAvaliados.some(servico => servico.taskLocation.locationGroup === local.locationGroup)
        );
      }
    }

    if (this.filtroLocationGroup) {
      if (this.avaliacaoTab == 0) {
        this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);;
        this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
      }
      if (this.avaliacaoTab == 1) {
        this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);;
        this.listaLocalServicoFiltrada = this.servicosParaReavaliacaoFiltrados.map(servico => servico.taskLocation);
      }
      if (this.avaliacaoTab == 2) {
        this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);;
        this.listaLocalServicoFiltrada = this.servicosAvaliadosFiltrados.map(servico => servico.taskLocation);
      }
      
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.locationGroup === this.filtroLocationGroup);

      const uniqueLocationSubGroups1: { [key: string]: string } = {}; //Adiciona um index a consulta para não trazer valores repetidos
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup1) {
          uniqueLocationSubGroups1[localServico.subGroup1] = localServico.subGroup1;
        }
      });
      this.listaSubGroup1FiltradaConsulta = Object.values(uniqueLocationSubGroups1);
      if (this.avaliacaoTab == 0) {
        this.listaSubGroup1FiltradaConsulta = this.listaSubGroup1FiltradaConsulta.filter(subGroup1 => 
          this.servicosAguardandoAvaliacao.some(servico => servico.taskLocation.subGroup1 === subGroup1)
        );
      }
      if (this.avaliacaoTab == 1) {
        this.listaSubGroup1FiltradaConsulta = this.listaSubGroup1FiltradaConsulta.filter(subGroup1 => 
          this.servicosParaReavaliacao.some(servico => servico.taskLocation.subGroup1 === subGroup1)
        );
      }
      if (this.avaliacaoTab == 2) {
        this.listaSubGroup1FiltradaConsulta = this.listaSubGroup1FiltradaConsulta.filter(subGroup1 => 
          this.servicosAvaliados.some(servico => servico.taskLocation.subGroup1 === subGroup1)
        );
      }
    }

    if (this.filtroSubGroup1) {
      if (this.avaliacaoTab == 0) {
        this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
        this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
      }
      if (this.avaliacaoTab == 1) {
        this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
        this.listaLocalServicoFiltrada = this.servicosParaReavaliacaoFiltrados.map(servico => servico.taskLocation);
      }
      if (this.avaliacaoTab == 2) {
        this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
        this.listaLocalServicoFiltrada = this.servicosAvaliadosFiltrados.map(servico => servico.taskLocation);
      }
           
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup1 === this.filtroSubGroup1);

      const uniqueLocationSubGroups2: { [key: string]: string } = {};
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup2) {
          uniqueLocationSubGroups2[localServico.subGroup2] = localServico.subGroup2;
        }
      });
      this.listaSubGroup2FiltradaConsulta = Object.values(uniqueLocationSubGroups2);
      if (this.avaliacaoTab == 0) {
        this.listaSubGroup2FiltradaConsulta = this.listaSubGroup2FiltradaConsulta.filter(subGroup2 => 
          this.servicosAguardandoAvaliacao.some(servico => servico.taskLocation.subGroup2 === subGroup2)
        );
      }
      if (this.avaliacaoTab == 1) {
        this.listaSubGroup2FiltradaConsulta = this.listaSubGroup2FiltradaConsulta.filter(subGroup2 => 
          this.servicosParaReavaliacao.some(servico => servico.taskLocation.subGroup2 === subGroup2)
        );
      }
      if (this.avaliacaoTab == 2) {
        this.listaSubGroup2FiltradaConsulta = this.listaSubGroup2FiltradaConsulta.filter(subGroup2 => 
          this.servicosAvaliados.some(servico => servico.taskLocation.subGroup2 === subGroup2)
        );
      }
    }

    if (this.filtroSubGroup2) {
      if (this.avaliacaoTab == 0) {
        this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
        this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
      }
      if (this.avaliacaoTab == 1) {
        this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacaoFiltrados.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
        this.listaLocalServicoFiltrada = this.servicosParaReavaliacaoFiltrados.map(servico => servico.taskLocation);
      }
      if (this.avaliacaoTab == 2) {
        this.servicosAvaliadosFiltrados = this.servicosAvaliadosFiltrados.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
        this.listaLocalServicoFiltrada = this.servicosAvaliadosFiltrados.map(servico => servico.taskLocation);
      }
      
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup2 === this.filtroSubGroup2);

      const uniqueLocationSubGroups3: { [key: string]: string } = {};
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup3) {
          uniqueLocationSubGroups3[localServico.subGroup3] = localServico.subGroup3;
        }
      });
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
    this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
    this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
    this.servicosAvaliadosFiltrados = this.servicosAvaliados;
    this.updateDisplayedColumnsBuilder();
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
    this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
    this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
    this.servicosAvaliadosFiltrados = this.servicosAvaliados;
    this.updateDisplayedColumnsBuilder();
    this.filtrarDados();
  }

  onFiltroCostCenterChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroCentroCustoSelecionado = null;
    } else {
      this.filtroCentroCustoSelecionado = novoFiltro;
    }
    this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
    this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
    this.servicosAvaliadosFiltrados = this.servicosAvaliados;
    this.filtroLocationGroup = null;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.updateDisplayedColumnsCostCenter();
    this.filtrarDados();
  }

  onFiltroLocationGroupChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroLocationGroup = null;
    } else {
      this.filtroLocationGroup = novoFiltro;
    }
    this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
    this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
    this.servicosAvaliadosFiltrados = this.servicosAvaliados;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.updateDisplayedColumnsLocationGroup()
    this.filtrarDados();
  }

  onFiltroSubGroup1Change(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSubGroup1 = null;
    } else {
      this.filtroSubGroup1 = novoFiltro;
    }
    this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
    this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
    this.servicosAvaliadosFiltrados = this.servicosAvaliados;
    this.filtroSubGroup2 = null;
    this.updateDisplayedColumnsSubGroup1()
    this.filtrarDados();
  }

  onFiltroSubGroup2Change(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSubGroup2 = null;
    } else {
      this.filtroSubGroup2 = novoFiltro;
    }
    this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacao;
    this.servicosParaReavaliacaoFiltrados = this.servicosParaReavaliacao;
    this.servicosAvaliadosFiltrados = this.servicosAvaliados;
    this.filtrarDados();
  }

  async mudarAba(posicao: number) {
    this.avaliacaoTab = posicao;
    if (posicao === 0) {
      await this.buscarServicosAguardandoAvaliacao();
    } else if (posicao === 1) {
      await this.buscarServicosParaReavaliacao();
    } else if (posicao === 2) {
      await this.buscarServicosAvaliados();
    }
    this.limparFiltros();
  }

  async buscarServicosAguardandoAvaliacao() {
    try {
      this.spinner.show();
      const servicos: any = await firstValueFrom(this.avaliacaoService.buscarServicosAguardandoAvaliacao());
      this.servicosAguardandoAvaliacao = servicos;
      this.servicosAguardandoAvaliacaoFiltrada = servicos;
      this.filtrarDados();
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  listarFuncionarios() {
    this.usuarioService.listarUsuariosPorRole('FUNCIONARIO').pipe(
      tap(retorno => {
        this.listaFuncionarios = retorno;
      }),
      catchError(error => {
        console.error(error);
        return of();
      })
    ).subscribe();
  }

  listarConferentes() {
    this.usuarioService.listarUsuariosPorRole('CONFERENTE').pipe(
      tap(retorno => {
        this.listaConferentes = retorno;
      }),
      catchError(error => {
        console.error(error);
        return of();
      })
    ).subscribe();
  }

  modalAvaliarServico(servico: ServicoModel) {
    this.servicoSelecionadoAvaliacao = cloneDeep(servico);//Clonando objeto e não a sua referência
    this.renderModalAvaliacaoServico = true;
    const currentLang = this.translate.currentLang || 'pt-br';
    this.currentLang = currentLang;
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.expectedStartDateFormatada = formatDate(this.servicoSelecionadoAvaliacao.expectedStartDate, "dd/MM/yyyy", currentLang);
    this.expectedEndDateFormatada = formatDate(this.servicoSelecionadoAvaliacao.expectedEndDate, "dd/MM/yyyy", currentLang);
    this.avaliacaoModel.task = this.servicoSelecionadoAvaliacao;
    Swal.fire({
      title: this.translate.instant('EVALUATION.SERVICE_EVALUATION'),
      width: '80%',
      html: this.modalAvaliacaoServico.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('EVALUATION.ATTACH_PHOTOS'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('EVALUATION.CANCEL'),
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.avaliacaoModel.parameter0Result === false || this.avaliacaoModel.parameter1Result === false ||
          this.avaliacaoModel.parameter2Result === false || this.avaliacaoModel.parameter3Result === false ||
          this.avaliacaoModel.parameter4Result === false || this.avaliacaoModel.parameter5Result === false ||
          this.avaliacaoModel.parameter6Result === false || this.avaliacaoModel.parameter7Result === false ||
          this.avaliacaoModel.parameter8Result === false || this.avaliacaoModel.parameter9Result === false) {
          this.avaliacaoModel.assessmentResult = false;
          } else {
            this.avaliacaoModel.assessmentResult = true;
          }
        this.avaliacaoModel.taskExecutors = this.servicoSelecionadoAvaliacao.executors ? this.servicoSelecionadoAvaliacao.executors : [];
        this.avaliacaoModel.taskEvaluators = this.servicoSelecionadoAvaliacao.evaluators ? this.servicoSelecionadoAvaliacao.evaluators : [];
        if (this.validarCampos(this.avaliacaoModel)) {
          this.avaliacaoModel.task = this.servicoSelecionadoAvaliacao;
          this.avaliacaoModel.task.startDate = new Date(this.servicoSelecionadoAvaliacao.startDate!);
          this.avaliacaoModel.task.finalDate = new Date(this.servicoSelecionadoAvaliacao.finalDate!);
          let retornoAvaliacao: AvaliacaoModel = new AvaliacaoModel();
          this.avaliacaoService.avaliar(this.avaliacaoModel).pipe(
            tap(retorno => {
              retornoAvaliacao = retorno;
              this.modalFotos(retornoAvaliacao);
            }),
            catchError(error => {
                Swal.fire({
                  text: error.error,
                  icon: "error",
                  showConfirmButton: false,
                  timer: 2500
                });
              return of();
            })
          ).subscribe();
        } else {
          Swal.fire({
            text: this.msgErroValidacao,
            icon: "error",
            showConfirmButton: false,
            timer: 2500,
          }).then((resultWarn) => {
            if (resultWarn.isDismissed) {
              this.modalAvaliarServico(this.servicoSelecionadoAvaliacao);
              this.modalAvaliacaoServico.nativeElement.querySelector(this.campoErroValidacao).focus();
            };
          });
        }
      } else {
        Swal.fire({
          text: this.translate.instant('EVALUATION.UNSAVED_CHANGES_CONFIRMATION'),
          icon: "warning",
          confirmButtonColor: '#4caf50',
          confirmButtonText: this.translate.instant('EVALUATION.RETURN_TO_EDIT'),
          showCancelButton: true,
          cancelButtonText: this.translate.instant('EVALUATION.DISCARD'),
          cancelButtonColor: '#dc3741'
        }).then((resultCancel) => {
          if (resultCancel.isDismissed) {
            Swal.fire({
              text: this.translate.instant('EVALUATION.CHANGES_DISCARDED'),
              icon: "success",
              showConfirmButton: false,
              timer: 2500,
            })
            this.limparDados();
          } else {
            this.modalAvaliarServico(this.servicoSelecionadoAvaliacao);
          }
        })
      }
    });
  }

  async inserirValorProducao(valorProucao: ValorProducaoModel) {
    try {
      await firstValueFrom(this.valorProducaoService.inserirValorProducao(valorProucao));
    } catch (error) {
      console.error(error);
    }

  }

  async modalVisualizarAvaliacao(avaliacao: AvaliacaoModel) {
    this.servicoSelecionadoAvaliacao = cloneDeep(avaliacao.task);//Clonando objeto e não a sua referência
    const currentLang = this.translate.currentLang;
    const dateFormat = currentLang === 'en' ? 'MM/dd/yyyy' : 'dd/MM/yyyy';
    const locale = currentLang === 'en' ? 'en-US' : 'pt-BR';

    this.expectedStartDateFormatada = formatDate(this.servicoSelecionadoAvaliacao.expectedStartDate, dateFormat, locale);
    this.expectedEndDateFormatada = formatDate(this.servicoSelecionadoAvaliacao.expectedEndDate, dateFormat, locale);
    this.realStartDateFormatada = formatDate(this.servicoSelecionadoAvaliacao.startDate!, dateFormat, locale);
    this.realEndDateFormatada = this.servicoSelecionadoAvaliacao.finalDate 
      ? formatDate(this.servicoSelecionadoAvaliacao.finalDate, dateFormat, locale) 
      : null;
    this.avaliacaoModel = cloneDeep(avaliacao);
    await this.buscarValorProducaoPorAvaliacao(this.avaliacaoModel.id!);
    this.dataAvalicaoFormatada = formatDate(this.avaliacaoModel.assessmentDate, dateFormat, locale);
    
    let fotosArray: any[] = [];
    fotosArray.push(this.avaliacaoModel.assessmentPhoto0);
    fotosArray.push(this.avaliacaoModel.assessmentPhoto1);
    fotosArray.push(this.avaliacaoModel.assessmentPhoto2);
    fotosArray.push(this.avaliacaoModel.assessmentPhoto3);
    fotosArray.push(this.avaliacaoModel.assessmentPhoto4);
    fotosArray.push(this.avaliacaoModel.assessmentPhoto5);
    await this.fetchImageDownload(fotosArray);

    this.rendermodalVisualizarAvaliacaoConcluida = true;
    Swal.fire({
      title: this.translate.instant('EVALUATION.SERVICE_EVALUATION'),
      width: '80%',
      html: this.modalVisualizarAvaliacaoConcluida.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'blue',
      confirmButtonText: this.translate.instant('EVALUATION.CLOSE'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalListarAvaliacoes(this.servicoSelecionadoAvaliacao);
      }
    });
  }

  addExecutor() {
    if (this.additionalExecutors.length < 5) { // Limita a adição de executores a 6
      this.additionalExecutors.push(this.additionalExecutors.length + 1); // Começa a contar a partir do 2º executor pois o primeiro é obrigatório
      this.executorPercentages.push(0); // Adiciona uma nova porcentagem para o novo executor
    }
  }
  
  removeExecutor() {
    if (this.additionalExecutors.length > 0) {
      const lastExecutorIndex = this.additionalExecutors.length - 1;
      this.additionalExecutors.pop();
      if (this.servicoSelecionadoAvaliacao.executors && this.servicoSelecionadoAvaliacao.executors.length > lastExecutorIndex + 1) {
        this.servicoSelecionadoAvaliacao.executors.splice(lastExecutorIndex + 1, 1);
      }
      this.executorPercentages.splice(lastExecutorIndex, 1); // Remove a porcentagem do executor removido
    }
  }

  addEvaluator() {
    if (this.additionalEvaluators.length < 3) { // Limita a adição de executores a 4
      this.additionalEvaluators.push(this.additionalEvaluators.length + 1); // Começa a contar a partir do 2º conferente pois o 1º é obrigatório
    }
  }

  removeEvaluator() {
    if (this.additionalEvaluators.length > 0) {
      const lastEvaluatorIndex = this.additionalEvaluators.length - 1;
      this.additionalEvaluators.pop();
      if (this.servicoSelecionadoAvaliacao.evaluators && this.servicoSelecionadoAvaliacao.evaluators.length > lastEvaluatorIndex + 1) {
        this.servicoSelecionadoAvaliacao.evaluators.splice(lastEvaluatorIndex + 1, 1);
      }
    }
  }

  async modalFotos(avaliacao: AvaliacaoModel) {
    this.renderModalAnexarFotos = true;
    this.fetchImage(avaliacao.id!);
    Swal.fire({
      title: this.translate.instant('EVALUATION.ATTACH_PHOTOS'),
      width: '80%',
      html: this.modalAnexarFotos.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('EVALUATION.COMPLETE_EVALUATION'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('EVALUATION.CANCEL_EVALUATION'),
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.validarQtdFotos()) {
          let photos = this.fotosServicoBlob.map(file => {
            return {
              buffer: file,
              name: '.jpg'
            };
          });
          this.spinner.show();
          this.avaliacaoService.updateAssessmentPhotos(avaliacao.id!, photos).pipe(
            tap(retorno => {
              this.spinner.hide();
              if (avaliacao.assessmentResult) {
                Swal.fire({
                  html: this.translate.instant('EVALUATION.EVALUATION_SAVED_APPROVED'),
                  icon: "success",
                  showConfirmButton: false,
                  timer: 2500,
                }).then((result) => {
                  if (this.avaliacaoTab == 0) {
                    this.buscarServicosAguardandoAvaliacao();
                  }
                  if (this.avaliacaoTab == 1) {
                    this.buscarServicosParaReavaliacao();
                  }
                });
              } else {
                Swal.fire({
                  html: this.translate.instant('EVALUATION.EVALUATION_SAVED_REJECTED'),
                  icon: "warning",
                  showConfirmButton: false,
                  timer: 2500,
                }).then((result) => {
                  if (this.avaliacaoTab == 0) {
                    this.buscarServicosAguardandoAvaliacao();
                  }
                  if (this.avaliacaoTab == 1) {
                    this.buscarServicosParaReavaliacao();
                  }
                });
              }
            }),
            catchError(error => {
              this.spinner.hide();
              this.avaliacaoService.deletarAvaliacao(avaliacao.id!).pipe().subscribe();
              this.spinner.hide();
              Swal.fire({
                text: error.error,
                icon: "error",
                showConfirmButton: false,
                timer: 2500
              });
              return of();
            })
          ).subscribe();
          avaliacao.taskExecutors.forEach((executor, index) => {
            if (avaliacao.assessmentResult) {
              this.valorProducaoModel.value = avaliacao.task.amount * 
              this.executorPercentages[index] / 100;
            } else {
              this.valorProducaoModel.value = 0;
            }
            this.valorProducaoModel.user = executor;
            this.valorProducaoModel.task = avaliacao.task;
            this.valorProducaoModel.date = new Date();
            this.valorProducaoModel.assessment = avaliacao;
            this.valorProducaoModel.assessmentPercentage = this.executorPercentages[index];
            
            this.inserirValorProducao(this.valorProducaoModel);
          });
          this.limparDados();
        } else {
          Swal.fire({
            text: this.msgErroValidacao,
            icon: "error",
            showConfirmButton: false,
            timer: 2500,
          }).then((resultWarn) => {
            if (resultWarn.isDismissed) {
              this.modalFotos(avaliacao);
            };
          });
        }
      } else {
        Swal.fire({
          text: this.translate.instant('EVALUATION.UNSAVED_CHANGES_CONFIRM'),
          icon: "warning",
          confirmButtonColor: '#4caf50',
          confirmButtonText: 'Voltar a editar',
          showCancelButton: true,
          cancelButtonText: "Descartar",
          cancelButtonColor: '#dc3741'
        }).then((resultCancel) => {
          if (resultCancel.isDismissed) {
            this.avaliacaoService.deletarAvaliacao(avaliacao.id!).pipe().subscribe();
            Swal.fire({
              text: this.translate.instant('EVALUATION.CHANGES_DISCARDED'),
              icon: "success",
              showConfirmButton: false,
              timer: 2500,
            })
            this.limparDados();
          } else {
            this.modalFotos(avaliacao);
          }
        })
      }
    });
  }

  async buscarValorProducaoPorAvaliacao(avaliacaoId: number) {
    try {
      const producoes: any = await firstValueFrom(this.valorProducaoService.buscarValorProducaoPorAvaliacao(avaliacaoId));
      this.valoresProducao = producoes;
    } catch (error) {
      console.error(error);
    }
  }

  getAssessmentPercentageForExecutor(executor: UsuarioModel): number {
    const valorProducao = this.valoresProducao.find(vp => vp.user.id === executor.id);
    return valorProducao ? valorProducao.assessmentPercentage : 0;
}

  validarCampos(avaliacao: AvaliacaoModel) {
    if (avaliacao.task.startDate === null || avaliacao.task.startDate === undefined) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_START_DATE');
      this.campoErroValidacao = "#startDateAvaliacao";
      return false;
    }

    if (avaliacao.task.finalDate === null || avaliacao.task.finalDate === undefined) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_END_DATE');
      this.campoErroValidacao = "#finalDateAvaliacao";
      return false;
    }

    if (avaliacao.task.finalDate < avaliacao.task.startDate) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_END_DATE_BEFORE_START');
      this.campoErroValidacao = "#finalDateAvaliacao";
      return false;
    }

    let finalDate = new Date(avaliacao.task.finalDate);
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (finalDate > today) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_END_DATE_AFTER_TODAY');
      this.campoErroValidacao = "#finalDateAvaliacao";
      return false;
    }

    if (avaliacao.taskExecutors === null || avaliacao.taskExecutors === undefined) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_EXECUTOR');
      this.campoErroValidacao = "#executorAvaliacao1";
      return false;
    }

    if (avaliacao.taskEvaluators === null || avaliacao.taskEvaluators === undefined) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_EVALUATOR');
      this.campoErroValidacao = "#evaluatorAvaliacao1";
      return false;
    }

    if (avaliacao.parameter0Result === undefined || avaliacao.parameter0Result === null) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter0Name });
      this.campoErroValidacao = "#parameter0ResultAvaliacao";
      return false;
    }

    if (avaliacao.parameter1Result === undefined || avaliacao.parameter1Result === null) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter1Name });
      this.campoErroValidacao = "#parameter1ResultAvaliacao";
      return false;
    }

    if (avaliacao.parameter2Result === undefined || avaliacao.parameter2Result === null) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter2Name });
      this.campoErroValidacao = "#parameter2ResultAvaliacao";
      return false;
    }

    if (avaliacao.task.taskType.parameter3Name != null) {
      if (avaliacao.parameter3Result === undefined || avaliacao.parameter3Result === null) {
        this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter3Name });
        this.campoErroValidacao = "#parameter3ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter4Name != null) {
      if (avaliacao.parameter4Result === undefined || avaliacao.parameter4Result === null) {
        this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter4Name });
        this.campoErroValidacao = "#parameter4ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter5Name != null) {
      if (avaliacao.parameter5Result === undefined || avaliacao.parameter5Result === null) {
        this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter5Name });
        this.campoErroValidacao = "#parameter5ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter6Name != null) {
      if (avaliacao.parameter6Result === undefined || avaliacao.parameter6Result=== null) {
        this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter6Name });
        this.campoErroValidacao = "#parameter6ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter7Name != null) {
      if (avaliacao.parameter7Result === undefined || avaliacao.parameter7Result === null) {
        this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter7Name });
        this.campoErroValidacao = "#parameter7ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter8Name != null) {
      if (avaliacao.parameter8Result === undefined || avaliacao.parameter8Result === null) {
        this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter8Name });
        this.campoErroValidacao = "#parameter8ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter9Name != null) {
      if (avaliacao.parameter9Result === undefined || avaliacao.parameter9Result === null) {
        this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_RESULT', { parameterName: avaliacao.task.taskType.parameter9Name });
        this.campoErroValidacao = "#parameter9ResultAvaliacao";
        return false;
      }
    }

    const rateioSoma = this.executorPercentages.reduce((a, b) => a + b, 0);
    if (rateioSoma !== 100) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_TOTAL_PERCENTAGE');this.msgErroValidacao = 'A soma total das porcentagens de Rateio dos Executores deve ser igual a 100!';
      this.campoErroValidacao = "#rateioExecutor0";
      return false;
    }

    if (this.executorPercentages.some(percentage => percentage === 0)) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_ZERO_PERCENTAGE');
      this.campoErroValidacao = "#rateioExecutor0";
      return false;
    }

    if (new Set(avaliacao.taskExecutors.map(executor => executor.id)).size !== avaliacao.taskExecutors.length) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_DUPLICATE_EXECUTORS');
      this.campoErroValidacao = "#executorAvaliacao1";
      return false;
  }
    
    return true;
  }

  validarQtdFotos() {
    if (this.fotosServicoBlob.length < 3) {
      this.msgErroValidacao = this.translate.instant('EVALUATION.ERROR_REQUIRED_START_DATE');
      return false;
    } else {
      return true;
    }
  }

  async buscarServicosAvaliados() {
    try {
      this.spinner.show();
      const servicosAvaliados: any = await firstValueFrom(this.avaliacaoService.buscarServicosAvaliados());
      this.servicosAvaliados = servicosAvaliados;
      this.servicosAvaliadosFiltrados = servicosAvaliados;
      this.filtrarDados();
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  async buscarServicosParaReavaliacao() {
    try {
      this.spinner.show();
      const servicosParaReavaliacao: any = await firstValueFrom(this.avaliacaoService.buscarServicosParaReavaliacao());
      this.servicosParaReavaliacao = servicosParaReavaliacao;
      this.servicosParaReavaliacaoFiltrados = servicosParaReavaliacao;
      this.filtrarDados();
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  handleFileInput(target: EventTarget | null, index: number) {
    if (!target) {
      return;
    }
  
    const files = (target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }
  
    const file = files.item(0);
    if (!file) {
      return;
    }
  
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      Swal.fire({
        text: "Por favor, selecione uma imagem em formato .png ou .jpg",
        icon: "error",
        showConfirmButton: false,
        timer: 2500
      });
      this.isFileValid = false;
      return;
    } else {
      this.isFileValid = true;
    }
  
    if (this.isFileValid) {
      if (this.fileToUpload) {
        this.fileToUpload[index] = file;
      }
  
      const reader = new FileReader();
      this.fileIsLoading = true;
      reader.onload = (event: any) => {
        const byteArray = new Uint8Array(event.target.result);
        let base64String = '';
        const chunkSize = 5000; // Tamanho do pedaço
        for (let i = 0; i < byteArray.length; i += chunkSize) {
          const chunk = byteArray.slice(i, i + chunkSize);
          base64String += btoa(String.fromCharCode(...chunk));
        }
        this.fotosServicoBlob[index] = new Uint8Array(byteArray.buffer);
        this.fileIsLoading = false;
      }
      reader.readAsArrayBuffer(file);
      const blob = new Blob([file]);
      this.fotosServico[index] = URL.createObjectURL(blob);
    }
  }
  
  triggerFileInput(index: number) {
    const fileInput = document.getElementById('avaliacaoFoto' + index) as HTMLInputElement;
    fileInput.click();
  }

  async fetchImage(avaliacaoId: number) {
    let avaliacaoFotos: AvaliacaoModel = new AvaliacaoModel();
    try {
      const avaliacao: any = await firstValueFrom(this.avaliacaoService.buscarAvaliacaoPorId(avaliacaoId));
      avaliacaoFotos = avaliacao;
      const defaultImage = "assets/EmptyImg.jpg"; // Imagem padrão
  
      this.fotosServico[0] = avaliacaoFotos.assessmentPhoto0 || defaultImage;
      this.fotosServico[1] = avaliacaoFotos.assessmentPhoto1 || defaultImage;
      this.fotosServico[2] = avaliacaoFotos.assessmentPhoto2 || defaultImage;
      this.fotosServico[3] = avaliacaoFotos.assessmentPhoto3 || defaultImage;
      this.fotosServico[4] = avaliacaoFotos.assessmentPhoto4 || defaultImage;
      this.fotosServico[5] = avaliacaoFotos.assessmentPhoto5 || defaultImage;
    
    } catch (error) {
      console.error(error);
    }
  }

  limparDados() {
    this.servicoSelecionadoAvaliacao = new ServicoModel();
    this.avaliacaoModel = new AvaliacaoModel();
    this.additionalExecutors.length = 0;
    this.additionalEvaluators.length = 0;
    this.executorPercentages.forEach(percentage => percentage = 0);
    this.executorPercentages.length = 0;
    this.executorPercentages.push(100);
    this.fotosServicoBlob = [];
    this.fotosServico = [];
  }

  async buscarAvaliacoesPorServico(servicoId: number) {
    try {
      this.spinner.show();
      const avaliacoes: any = await firstValueFrom(this.avaliacaoService.buscarAvaliacoesPorServico(servicoId));
      this.avaliacoesRealizadasPorServico = avaliacoes;
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  modalListarAvaliacoes(servico: ServicoModel) {
    this.buscarAvaliacoesPorServico(servico.id!);
    this.renderModalAvaliacoesRealizadasPorServico = true;
    Swal.fire({
      html: this.modalAvaliacoesRealizadasPorServico.nativeElement,
      showCloseButton: true,
      showConfirmButton: false,
    });
  }

  fetchImageDownload(blobNameWithoutExtension: string[]): void {
    this.fotosServico = []; // Inicializa como array vazio
    const nomesValidos = blobNameWithoutExtension.filter(name => name !== null && name !== "" && name !== undefined);
    this.avaliacaoService.downloadAssessmentPhotos(nomesValidos)
    .subscribe(blobs => {
      blobs.forEach(blob => {
        const imageUrl = URL.createObjectURL(blob);
        this.fotosServico.push(imageUrl); // Adiciona URL da imagem ao array
      });
    });
  }

  openImage(url: string) {
    Swal.fire({
      imageUrl: url,
      width: '80%',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Download',
      confirmButtonColor: 'green',
      showCancelButton: true,
      cancelButtonText: 'Fechar',
      cancelButtonColor: 'blue',
    }).then((result) => {
      if (result.isConfirmed) {
        const link = document.createElement('a');
        link.href = url;
        const fileName = url.split('/').pop(); // Extrai o nome do arquivo da URL
        link.download = fileName + ".jpg";
        link.click();
        this.modalVisualizarAvaliacao(this.avaliacaoModel);
      }
      if (result.dismiss) {
        this.modalVisualizarAvaliacao(this.avaliacaoModel);
      }
    });
  }
}
