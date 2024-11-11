import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServicoModel } from './model/servico.model';
import { ServicoService } from './service/servico.service';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { LocalServicoModel } from '../local-servico/model/local-servico.model';
import { LocalServicoService } from '../local-servico/service/local-servico.service';
import { TiposServicoService } from '../tipo-servico/service/tipos-servico.service';
import { TipoServicoModel } from '../tipo-servico/model/tipo-servico.model';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss']
})
export class ServicoComponent implements OnInit {

  @ViewChild('modalVisualizarDetalhes', { static: true })
  modalVisualizarDetalhes!: ElementRef;

  @ViewChild('arquivoXLSX', { static: false }) arquivoXLSX!: ElementRef;

  servicoModel = new ServicoModel();
  cadastroServico = new ServicoModel();
  construtora: ConstrutoraModel | null = null;
  centroCusto: CentroCustoModel | null = null;
  listaServicos: ServicoModel[] = [];
  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  listaLocais: LocalServicoModel[] = [];
  listaSubGroup1: string[] = [];
  listaSubGroup2: string[] = [];
  listaSubGroup3: string[] = [];
  listaTiposServico: TipoServicoModel[] = [];
  displayedColumns: string[] = ["acoes", "costCenter", "locationGroup", 'subGroup1', 'subGroup2', 'taskType', 'dimension', 'unitMeasurement'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  filtroSelecionado: string | null = null;
  listaServicosFiltrada: ServicoModel[] = [];
  listaCentrosDeCustoFiltrada: CentroCustoModel[] = [];
  servicoTab: number = 0;
  arquivoSelecionado: File | undefined;
  currencyPrefix: string = "pt-br";

  constructor(
    private servicoService: ServicoService,
    private construtoraService: ConstrutoraService,
    private centroCustoService: CentroCustoService,
    private localService: LocalServicoService,
    private tiposServicoService: TiposServicoService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.buscarConstrutoras();
    this.buscarTiposServico();
    this.cadastroServico.taskLocation = {
      locationGroup: '',
      subGroup1: '',
      subGroup2: '',
      subGroup3: '',
      costCenter: {} as CentroCustoModel
    };
    this.setCurrencyPrefix();
    this.translate.onLangChange.subscribe(() => {
      this.setCurrencyPrefix();
    });
  }

  async mudarAba(posicao: number) {
    if (posicao === 0) {
      this.servicoTab = posicao;
      this.cadastroServico = new ServicoModel();
    } else if (posicao === 1) {
      this.servicoTab = posicao;
    } else if (posicao === 2) {
      this.servicoTab = posicao;
      await this.buscarServicos();;
    }
    this.limparCampos()
  }

  compareFnConstrutora(c1: ConstrutoraModel, c2: ConstrutoraModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareFnCentroCusto(c1: CentroCustoModel, c2: CentroCustoModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  setCostCenter(value: CentroCustoModel | null) {
    if (value !== null && value.id !== undefined) {
      this.cadastroServico.costCenter = value;
      this.buscarLocaisPorCentroDeCusto(value.id);
    }
  }

  async buscarServicos() {
    try {
      this.spinner.show();
      const servicos: any = await firstValueFrom(this.servicoService.listarServicos());
      this.listaServicos = servicos;
      this.spinner.hide();
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

  async buscarCentrosDeCustoPorConstrutora(id: number) {
    try {
      const centros: any = await firstValueFrom(this.centroCustoService.listarCentrosDeCustoPorConstrutora(id));
      this.listaCentrosDeCusto = centros;
    } catch (error) {
      console.error(error);
    }
  }

  async buscarLocaisPorCentroDeCusto(id: number) {
    try {
      const locais: any = await firstValueFrom(this.localService.listarLocaisPorCentroDeCusto(id));
      this.listaLocais = locais;
    } catch (error) {
      console.error(error);
    }
  }


  async buscarTiposServico() {
    try {
      const tipos: any = await firstValueFrom(this.tiposServicoService.listarTiposDeServico());
      this.listaTiposServico = tipos;
    } catch (error) {
      console.error(error);
    }
  }

  filtrarNivel2(nivel1: string | undefined) {
    if (nivel1 !== undefined) {
      // Filtrar dados do nível 2 baseado na seleção do nível 1
      this.listaSubGroup1 = this.listaLocais
        .filter(local => local.locationGroup === nivel1)
        .map(local => local.subGroup1)
        .filter((subGroup): subGroup is string => subGroup !== undefined)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
    }
  }

  filtrarNivel3(nivel1: string | undefined, nivel2: string | undefined) {
    if (nivel1 !== undefined && nivel2 !== undefined) {
      // Filtrar dados do nível 3 baseado na seleção do nível 1 e 2
      this.listaSubGroup2 = this.listaLocais
        .filter(local => local.locationGroup === nivel1 && local.subGroup1 === nivel2 &&
          local.subGroup2 !== undefined && local.subGroup2 !== '' && local.subGroup2 !== null)
        .map(local => local.subGroup2)
        .filter((subGroup): subGroup is string => subGroup !== undefined)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
    }
  }

  filtrarNivel4(nivel1: string | undefined, nivel2: string | undefined, nivel3: string | undefined) {
    if (nivel1 !== undefined && nivel2 !== undefined && nivel3 !== undefined) {
      // Filtrar dados do nível 4 baseado na seleção do nível 1, 2 e 3
      this.listaSubGroup3 = this.listaLocais
        .filter(local => local.locationGroup === nivel1 && local.subGroup1 === nivel2 &&
          local.subGroup2 === nivel3).map(local => local.subGroup3)
        .filter((subGroup): subGroup is string => subGroup !== undefined)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
    }
  }


  getLocationGroups() {
    const locationGroups = this.listaLocais.map(location => location.locationGroup);
    return locationGroups.filter((location, index) => locationGroups.indexOf(location) === index);
  }

  getSubGroup1Locations() {
    if (!this.cadastroServico.taskLocation.locationGroup) {
      return [];
    }

    const locations = this.listaLocais
      .filter(location => location.locationGroup === this.cadastroServico.taskLocation.locationGroup)
      .map(location => location.subGroup1);

    return locations.filter((location, index) => locations.indexOf(location) === index);
  }

  getSubGroup2Locations() {
    if (!this.cadastroServico.taskLocation.subGroup1) {
      return [];
    }

    const locations = this.listaLocais
      .filter(location => location.subGroup1 === this.cadastroServico.taskLocation.subGroup1)
      .map(location => location.subGroup2);

    return locations.filter((location, index) => locations.indexOf(location) === index);
  }

  getSubGroup3Locations() {
    if (!this.cadastroServico.taskLocation.subGroup2) {
      return [];
    }

    const locations = this.listaLocais
      .filter(location => location.subGroup2 === this.cadastroServico.taskLocation.subGroup2)
      .map(location => location.subGroup3);

    return locations.filter((location, index) => locations.indexOf(location) === index);
  }

  getSubGroup4Locations() {
    if (!this.cadastroServico.taskLocation.subGroup3) {
      return [];
    }

    const locations = this.listaLocais
      .filter(location => location.subGroup3 === this.cadastroServico.taskLocation.subGroup3)
      .map(location => location.subGroup3);

    return locations.filter((location, index) => locations.indexOf(location) === index);
  }

  parseValue(inputValue: string): number {
    let numberValue = inputValue.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(numberValue);
  }

  calcularValorTotal() {
    this.cadastroServico.amount = this.cadastroServico.dimension * this.cadastroServico.unitaryValue;
  }

  async cadastrarServico() {
    if (!this.validarCampos(this.cadastroServico)) {
      return;
    };
    this.cadastroServico.taskLocation.costCenter = this.cadastroServico.costCenter;
    this.cadastroServico.unitMeasurement = this.cadastroServico.taskType.unitMeasurement;
    this.spinner.show();
    this.servicoService.cadastrarServico(this.cadastroServico).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('SERVICE.CADASTRO_SUCESSO'),
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.limparCampos()
      }),
      catchError(error => {
        this.spinner.hide();
        if (error.error == "Task already exists") {
          Swal.fire({
            text: this.translate.instant('SERVICE.ERRO_SERVICO_EXISTENTE'),
            icon: "error",
            showConfirmButton: false,
            timer: 3000
          });
        }
        else {
          Swal.fire({
            text: error.error,
            icon: "error",
            showConfirmButton: false,
            timer: 3000
          });
        }
        return of();
      })
    ).subscribe();
  }

  atualizarServico(servico: ServicoModel) {
    if (!this.validarCampos(this.cadastroServico)) {
      return;
    };
    this.validarCampos(servico);
    this.spinner.show();
    this.servicoService.atualizarServico(servico).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('SERVICE.ATUALIZACAO_SUCESSO'),
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.buscarServicos();
      }),
      catchError(error => {
        this.spinner.hide();
        let msgErro = error.error;
        if (error.error === "No changes detected! Task not updated!") {
          msgErro = this.translate.instant('SERVICE.ERRO_NENHUMA_ALTERACAO');
        }
        if (error.error === "Task not found!") {
          msgErro = this.translate.instant('SERVICE.ERRO_SERVICO_NAO_ENCONTRADO');
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

  validarCampos(servico: ServicoModel) {
    if (servico.costCenter === null || servico.costCenter === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_CENTRO_CUSTO_OBRIGATORIO'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.taskType === null || servico.taskType === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_TIPO_SERVICO_OBRIGATORIO'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.taskLocation === null || servico.taskLocation === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_LOCAL_EXECUCAO_OBRIGATORIO'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.dimension === null || servico.dimension == 0
      || servico.dimension === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_LOCAL_EXECUCAO_OBRIGATORIO'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.expectedStartDate === null || servico.taskLocation === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_DATA_INICIO_OBRIGATORIO'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.expectedEndDate === null || servico.expectedEndDate === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_DATA_FINAL_OBRIGATORIO'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.expectedStartDate > servico.expectedEndDate) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_DATA_INICIO_POSTERIOR'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.unitaryValue === null || servico.unitaryValue === undefined
      || servico.unitaryValue === 0) {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_VALOR_UNITARIO_OBRIGATORIO'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    return true;
  }

  visualizarDetalhes(servico: ServicoModel) {
    this.servicoModel = JSON.parse(JSON.stringify(servico)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: this.translate.instant('SERVICE.DETALHES_TITULO'),
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('SERVICE.BOTAO_EDITAR'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalEditarServico(servico);
      }
    });
  }

  modalEditarServico(servico: ServicoModel) {
    this.indDesabilitaCampos = false;
    this.servicoModel = JSON.parse(JSON.stringify(servico)); //Clonando objeto e não a sua referência
    this.servicoModel.id = servico.id;
    this.renderModalVisualizar = true;
    Swal.fire({
      title: this.translate.instant('SERVICE.EDITAR_LOCAL_TITULO'),
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('SERVICE.BOTAO_SALVAR'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('SERVICE.BOTAO_CANCELAR'),
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.atualizarServico(this.servicoModel);
      } else if (result.isDismissed) {
        this.servicoModel = new ServicoModel();
      }
    });
  }

  calcularValorTotalModal() {
    this.servicoModel.amount = this.servicoModel.dimension * this.servicoModel.unitaryValue;
  }

  excluirServico(id: number) {
    Swal.fire({
      title: this.translate.instant('SERVICE.EXCLUIR_TITULO'),
      html: this.translate.instant('SERVICE.EXCLUIR_HTML'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('SERVICE.BOTAO_EXCLUIR'),
      confirmButtonColor: 'red',
      cancelButtonText: this.translate.instant('SERVICE.BOTAO_CANCELAR'),
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.servicoService.excluirServico(id).pipe(
          tap(retorno => {
            this.spinner.hide();
            Swal.fire({
              text: this.translate.instant('SERVICE.EXCLUIDO_SUCESSO'),
              icon: "success",
              showConfirmButton: false,
              timer: 3000
            });
            this.buscarServicos();
          }),
          catchError(error => {
            this.spinner.hide();
            let msgErro = error.error;
            if (msgErro === "Task with assessment cannot be deleted!") {
              msgErro = this.translate.instant('SERVICE.ERRO_AVALIACAO_EXISTENTE');
            }
            Swal.fire({
              text: msgErro,
              icon: "error",
              showConfirmButton: false,
              timer: 4000
            });
            return of();
          })
        ).subscribe();
      }
    });
  }

  limparCampos() {
    this.cadastroServico = new ServicoModel();
    this.centroCusto = null;
    this.construtora = null;
    this.listaTiposServico = [];
    this.buscarConstrutoras();
    this.buscarCentrosDeCustoPorConstrutora(0);
    this.buscarTiposServico();
    this.cadastroServico.taskLocation = {
      locationGroup: '',
      subGroup1: '',
      subGroup2: '',
      subGroup3: '',
      costCenter: {} as CentroCustoModel
    };
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.arquivoSelecionado = target.files[0];
    }
  }

  async cadastrarEmLote() {
    if (this.arquivoSelecionado) {
      this.spinner.show();
      try {
        const taskCount = await this.servicoService.enviarArquivo(this.arquivoSelecionado);
        this.spinner.hide();
        Swal.fire({
          html: `${this.translate.instant('SERVICE.ARQUIVO_SUCESSO')}<br> <b>${taskCount} ${this.translate.instant('SERVICE.NOVOS_SERVICOS_INCLUIDOS')}</b>`,
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.arquivoSelecionado = undefined;
      } catch (error) {
        this.spinner.hide();
        const message = (error as Error).message;
        Swal.fire({
          text: message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } else {
      Swal.fire(
        this.translate.instant('SERVICE.ERRO_TITULO'),
        this.translate.instant('SERVICE.ERRO_NENHUM_ARQUIVO'),
        'error'
      );
    }
  }

  triggerFileInput() {
    this.arquivoXLSX.nativeElement.click();
  }

  onDragOver(event: DragEvent) {
    // Prevent the browser's default behavior of opening the file
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    // Prevent the browser's default behavior of opening the file
    event.preventDefault();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.arquivoSelecionado = file;
    } else {
      Swal.fire({
        text: this.translate.instant('SERVICE.ERRO_FORMATO_ARQUIVO'),
        icon: 'error',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  setCurrencyPrefix(): void {
    const currentLang = this.translate.currentLang;
    this.currencyPrefix = currentLang === 'en' ? 'US$ ' : 'R$ ';
  }
}