import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AvaliacaoService } from './service/avaliacao.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
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

  @ViewChild('avaliacaoFoto0') avaliacaoFoto0!: ElementRef;

  avaliacaoTab: number = 0;
  servicosAguardandoAvaliacao: ServicoModel[] = [];
  servicosAguardandoAvaliacaoFiltrada: ServicoModel[] = [];
  servicosAvaliados: ServicoModel[] = [];
  servicosParaReavaliacao: ServicoModel[] = [];
  listaLocalServico: LocalServicoModel[] = [];
  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  localServicoModel = new LocalServicoModel();
  cadastroLocalServico = new LocalServicoModel();
  construtoraSelecionada: ConstrutoraModel = new ConstrutoraModel();
  listaCentrosDeCustoFiltrados: CentroCustoModel[] = [];
  renderModalAvaliacaoServico = false;
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
  listaFuncionarios: UsuarioModel[] = [];
  listaConferentes: UsuarioModel[] = [];
  additionalExecutors: number[] = [];
  additionalEvaluators: number[] = [];
  msgErroValidacao: string = "";
  campoErroValidacao: string = "";
  fotoServico0: string[] = [];
  fotoServico0Blob: Uint8Array[] = [];
  fileToUpload: File[] = [];
  fileIsLoading = false;
  isFileValid = false;

  constructor(
    private avaliacaoService: AvaliacaoService,
    private localServicoService: LocalServicoService,
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.fotoServico0 = [];
    this.buscarServicosAguardandoAvaliacao();
    this.buscarLocais();
    this.buscarConstrutoras();
    this.buscarCentrosDeCusto();
    this.updateDisplayedColumnsBuilder();
    this.filtrarDados();
    this.listarFuncionarios();
    this.listarConferentes();
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

    if (this.filtroConstrutoraSelecionado) {
      this.listaCentrosDeCustoFiltradaConsulta = this.listaCentrosDeCusto.filter(centroCusto => centroCusto.builder.builderName === this.filtroConstrutoraSelecionado);
      this.listaLocalServicoFiltrada = this.listaLocalServico.filter(localServico => localServico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
      this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(servico => servico.costCenter.builder.builderName === this.filtroConstrutoraSelecionado);
    } else {
      this.listaLocalServicoFiltrada = [...this.listaLocalServico];
    }

    if (this.filtroCentroCustoSelecionado) {
      this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);

      const uniqueLocationGroups: { [key: string]: LocalServicoModel } = {}; //Adiciona um index a consulta para não trazer valores repetidos
      this.listaLocalServicoFiltrada.forEach(localServico => {
        uniqueLocationGroups[localServico.locationGroup] = localServico;
      });
      this.listaLocationGroupFiltradaConsulta = Object.values(uniqueLocationGroups)
    }

    if (this.filtroLocationGroup) {
      this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.locationGroup === this.filtroLocationGroup);;
      this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.locationGroup === this.filtroLocationGroup);

      const uniqueLocationSubGroups1: { [key: string]: string } = {}; //Adiciona um index a consulta para não trazer valores repetidos
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup1) {
          uniqueLocationSubGroups1[localServico.subGroup1] = localServico.subGroup1;
        }
      });
      this.listaSubGroup1FiltradaConsulta = Object.values(uniqueLocationSubGroups1);
    }

    if (this.filtroSubGroup1) {
      this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.subGroup1 === this.filtroSubGroup1);
      this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup1 === this.filtroSubGroup1);

      const uniqueLocationSubGroups2: { [key: string]: string } = {};
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup2) {
          uniqueLocationSubGroups2[localServico.subGroup2] = localServico.subGroup2;
        }
      });
      this.listaSubGroup2FiltradaConsulta = Object.values(uniqueLocationSubGroups2);
    }

    if (this.filtroSubGroup2) {
      this.servicosAguardandoAvaliacaoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.filter(localServico => localServico.taskLocation.subGroup2 === this.filtroSubGroup2);
      this.listaLocalServicoFiltrada = this.servicosAguardandoAvaliacaoFiltrada.map(servico => servico.taskLocation);
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
      this.servicosAguardandoAvaliacaoFiltrada = servicos;
      this.filtrarDados();
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
    this.expectedStartDateFormatada = formatDate(this.servicoSelecionadoAvaliacao.expectedStartDate, "dd/MM/yyyy", "pt-BR");
    this.expectedEndDateFormatada = formatDate(this.servicoSelecionadoAvaliacao.expectedEndDate, "dd/MM/yyyy", "pt-BR");
    this.avaliacaoModel.task = this.servicoSelecionadoAvaliacao;
    Swal.fire({
      title: 'Avaliação de Serviço',
      width: '80%',
      html: this.modalAvaliacaoServico.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Anexar Fotos',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
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
                  timer: 2000
                });
              return of();
            })
          ).subscribe();
        } else {
          Swal.fire({
            text: this.msgErroValidacao,
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          }).then((resultWarn) => {
            if (resultWarn.isDismissed) {
              this.modalAvaliarServico(this.servicoSelecionadoAvaliacao);
              this.modalAvaliacaoServico.nativeElement.querySelector(this.campoErroValidacao).focus();
            };
          });
        }
      } else {
        Swal.fire({
          text: "As alterações não salvas serão perdidas, confirmar?",
          icon: "warning",
          confirmButtonColor: '#4caf50',
          confirmButtonText: 'Voltar a editar',
          showCancelButton: true,
          cancelButtonText: "Descartar",
          cancelButtonColor: '#dc3741'
        }).then((resultCancel) => {
          if (resultCancel.isDismissed) {
            Swal.fire({
              text: "Alterações descartadas.",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            this.modalAvaliarServico(this.servicoSelecionadoAvaliacao);
          }
        })
      }
    });
  }


  addExecutor() {
    if (this.additionalExecutors.length < 5) { // Limita a adição de executores a 6
      this.additionalExecutors.push(this.additionalExecutors.length + 1); // Começa a contar a partir do 2º executor pois o primeiro é obrigatório
    }
  }

  removeExecutor() {
    if (this.additionalExecutors.length > 0) {
      const lastExecutor = this.additionalExecutors.pop();
      delete this.additionalExecutors['executor' + lastExecutor + 'Name' as keyof typeof this.additionalExecutors];
    }
  }

  addEvaluator() {
    if (this.additionalEvaluators.length < 3) { // Limita a adição de executores a 4
      this.additionalEvaluators.push(this.additionalEvaluators.length + 1); // Começa a contar a partir do 2º conferente pois o 1º é obrigatório
    }
  }

  removeEvaluator() {
    if (this.additionalEvaluators.length > 0) {
      const lastEvaluator = this.additionalEvaluators.pop();
      delete this.additionalEvaluators['evaluator' + lastEvaluator + 'Name' as keyof typeof this.additionalEvaluators];
    }
  }

  modalFotos(avaliacao: AvaliacaoModel) {
    this.renderModalAnexarFotos = true;
    this.fetchImage(avaliacao.id!);
    Swal.fire({
      title: 'Anexar Fotos',
      width: '80%',
      html: this.modalAnexarFotos.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Concluir avaliação',
      showCancelButton: true,
      cancelButtonText: 'Cancelar avaliação',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        let photos = this.fotoServico0Blob.map(file => {
          return {
            buffer: file,
            name: '.jpg'
          };
        });
        this.avaliacaoService.updateAssessmentPhotos(avaliacao.id!, photos).pipe(
          tap(retorno => {
            Swal.fire({
              text: "Avaliação salva com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            this.buscarServicosAguardandoAvaliacao();
          }),
          catchError(error => {
            this.avaliacaoService.deletarAvaliacao(avaliacao.id!).pipe().subscribe();
            Swal.fire({
              text: error.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            });
            return of();
          })
        ).subscribe();
      } else {
        Swal.fire({
          text: "As alterações não salvas serão perdidas, confirmar?",
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
              text: "Alterações descartadas.",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            this.modalFotos(avaliacao);
          }
        })
      }
    });
  }

  avaliarServico(avaliacao: AvaliacaoModel) {
    if (!this.validarCampos(avaliacao)) {
      return;
    }
    this.avaliacaoService.avaliar(avaliacao).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Avaliação realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
      }),
      catchError(error => {
        let msgErro = error.error;
        if (error.error === "No changes detected! Location not updated!") {
          msgErro = "Nenhuma alteração detectada! Local não atualizado!";
        }
        if (error.error === "Task not found!") {
          msgErro = "Serviço não encontrado!";
        }
        Swal.fire({
          text: msgErro,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
        return of();
      })
    ).subscribe();
  }

  validarCampos(avaliacao: AvaliacaoModel) {
    if (avaliacao.task.startDate === null || avaliacao.task.startDate === undefined) {
      this.msgErroValidacao = "É necessário informar da data de início real do serviço!";
      this.campoErroValidacao = "#startDateAvaliacao";
      return false;
    }

    if (avaliacao.task.finalDate === null || avaliacao.task.finalDate === undefined) {
      this.msgErroValidacao = "É necessário informar da data de término real do serviço!";
      this.campoErroValidacao = "#finalDateAvaliacao";
      return false;
    }

    if (avaliacao.taskExecutors === null || avaliacao.taskExecutors === undefined) {
      this.msgErroValidacao = "É necessário informar pelo menos um Funcionário Executor!";
      this.campoErroValidacao = "#executorAvaliacao1";
      return false;
    }

    if (avaliacao.taskEvaluators === null || avaliacao.taskEvaluators === undefined) {
      this.msgErroValidacao = "É necessário informar pelo menos um Avaliador!";
      this.campoErroValidacao = "#evaluatorAvaliacao1";
      return false;
    }

    if (avaliacao.parameter0Result === undefined || avaliacao.parameter0Result === null) {
      this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter0Name + "!";
      this.campoErroValidacao = "#parameter0ResultAvaliacao";
      return false;
    }

    if (avaliacao.parameter1Result === undefined || avaliacao.parameter1Result === null) {
      this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter1Name + "!";
      this.campoErroValidacao = "#parameter1ResultAvaliacao";
      return false;
    }

    if (avaliacao.parameter2Result === undefined || avaliacao.parameter2Result === null) {
      this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter2Name + "!";
      this.campoErroValidacao = "#parameter2ResultAvaliacao";
      return false;
    }

    if (avaliacao.task.taskType.parameter3Name != null) {
      if (avaliacao.parameter3Result === undefined || avaliacao.parameter3Result === null) {
        this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter3Name + "!";
        this.campoErroValidacao = "#parameter3ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter4Name != null) {
      if (avaliacao.parameter4Result === undefined || avaliacao.parameter4Result === null) {
        this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter4Name + "!";
        this.campoErroValidacao = "#parameter4ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter5Name != null) {
      if (avaliacao.parameter5Result === undefined || avaliacao.parameter5Result === null) {
        this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter5Name + "!";
        this.campoErroValidacao = "#parameter5ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter6Name != null) {
      if (avaliacao.parameter6Result === undefined || avaliacao.parameter6Result=== null) {
        this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter6Name + "!";
        this.campoErroValidacao = "#parameter6ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter7Name != null) {
      if (avaliacao.parameter7Result === undefined || avaliacao.parameter7Result === null) {
        this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter7Name + "!";
        this.campoErroValidacao = "#parameter7ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter8Name != null) {
      if (avaliacao.parameter8Result === undefined || avaliacao.parameter8Result === null) {
        this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter8Name + "!";
        this.campoErroValidacao = "#parameter8ResultAvaliacao";
        return false;
      }
    }

    if (avaliacao.task.taskType.parameter9Name != null) {
      if (avaliacao.parameter9Result === undefined || avaliacao.parameter9Result === null) {
        this.msgErroValidacao = "É necessário informar o resultado do " + avaliacao.task.taskType.parameter9Name + "!";
        this.campoErroValidacao = "#parameter9ResultAvaliacao";
        return false;
      }
    }
    return true;
  }


  async buscarServicosAvaliados() {
    this.servicosAvaliados = await firstValueFrom(this.avaliacaoService.buscarServicosAvaliados());
  }

  async buscarServicosParaReavaliacao() {
    this.servicosParaReavaliacao = await firstValueFrom(this.avaliacaoService.buscarServicosParaReavaliacao());
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
        timer: 2000
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
        this.fotoServico0Blob[index] = new Uint8Array(byteArray.buffer);
        this.fileIsLoading = false;
      }
      reader.readAsArrayBuffer(file);
      const blob = new Blob([file]);
      this.fotoServico0[index] = URL.createObjectURL(blob);
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
  
      this.fotoServico0[0] = avaliacaoFotos.assessmentPhoto0 || defaultImage;
      this.fotoServico0[1] = avaliacaoFotos.assessmentPhoto1 || defaultImage;
      this.fotoServico0[2] = avaliacaoFotos.assessmentPhoto2 || defaultImage;
      this.fotoServico0[3] = avaliacaoFotos.assessmentPhoto3 || defaultImage;
      this.fotoServico0[4] = avaliacaoFotos.assessmentPhoto4 || defaultImage;
      this.fotoServico0[5] = avaliacaoFotos.assessmentPhoto5 || defaultImage;
    
      // else {
      //   this.perfilUsuarioService.downloadProfilePicture(blobNameWithoutExtension)
      //   .subscribe(blob => {
      //     this.fotoServico0 = URL.createObjectURL(blob);
      //   });
      // }
    } catch (error) {
      console.error(error);
    }
  }

  limparDados() {
    this.servicoSelecionadoAvaliacao = new ServicoModel();
    this.avaliacaoModel = new AvaliacaoModel();
  }

}
