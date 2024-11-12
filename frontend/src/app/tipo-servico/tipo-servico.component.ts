import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TipoServicoModel } from './model/tipo-servico.model';
import { TiposServicoService } from './service/tipos-servico.service';
import { UnidadeMedidaService } from '../unidade-medida/service/unidade-medida.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { UnidadeMedidaModel } from '../shared/model/unidade-medida.model';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tipo-servico',
  templateUrl: './tipo-servico.component.html',
  styleUrls: ['./tipo-servico.component.scss']
})
export class TipoServicoComponent implements OnInit {

  @ViewChild('modalVisualizarDetalhes', { static: true })
  modalVisualizarDetalhes!: ElementRef;

  tipoServicoModel = new TipoServicoModel();
  cadastroTipoDeServico = new TipoServicoModel();
  listaTipoDeServico: TipoServicoModel[] = [];
  listaUnidadesDeMedida: UnidadeMedidaModel[] = [];
  displayedColumns: string[] = ["acoes", "taskTypeName", "taskTypeDescription", 'unitMeasurement'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  iscadastroTipoDeServico = true;
  filtroSelecionado: string | null = null;
  additionalParameters: number[] = [];

  constructor(
    private tipoDeServicoService: TiposServicoService,
    private unidadeDeMedidaService: UnidadeMedidaService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.buscarUnidadesDeMedida();
  }

  async buscarTiposDeServico() {
    try {
      this.spinner.show();
      const tiposDeServico: any = await firstValueFrom(this.tipoDeServicoService.listarTiposDeServico());
      this.listaTipoDeServico = tiposDeServico;
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  async buscarUnidadesDeMedida() {
    try {
      this.spinner.show();
      const unidadesDeMedida: any = await firstValueFrom(this.unidadeDeMedidaService.listarUnidadesDeMedida());
      this.listaUnidadesDeMedida = unidadesDeMedida;
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.iscadastroTipoDeServico = !this.iscadastroTipoDeServico;
    if (!this.iscadastroTipoDeServico) {
      this.buscarTiposDeServico();
    }
    this.cadastroTipoDeServico = new TipoServicoModel();
    this.additionalParameters = [];
  }

  addParameter() {
    if (this.additionalParameters.length < 7) { // Limita a adição de parâmetros a 7, pois já temos 3 obrigatórios
      this.additionalParameters.push(this.additionalParameters.length + 3); // Começa a contar a partir do 4º parâmetro
    }
  }

  removeParameter() {
    if (this.additionalParameters.length > 0) {
      const lastParameter = this.additionalParameters.pop();
      delete this.cadastroTipoDeServico['parameter' + lastParameter + 'Name'];
    }
  }

  cadastrarTipoDeServico() {
    if (!this.validarCampos(this.cadastroTipoDeServico)) {
      return;
    };
    this.spinner.show();
    this.tipoDeServicoService.cadastrarTipoDeServico(this.cadastroTipoDeServico).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('SERVICE-TYPES.SUCCESS_MESSAGE'),
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.cadastroTipoDeServico = new TipoServicoModel();
        this.additionalParameters = [];
      }),
      catchError(error => {
        this.spinner.hide();
        if (error.error == "TaskType already exists") {
          Swal.fire({
            text: this.translate.instant('SERVICE-TYPES.ALREADY_EXISTS'),
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

  atualizarTipoDeServico(tipoServico: TipoServicoModel) {
    if (!this.validarCampos(tipoServico)) {
      return;
    };
    this.tipoDeServicoService.atualizarTipoDeServico(tipoServico).pipe(
      tap(retorno => {
        Swal.fire({
          text: this.translate.instant('SERVICE-TYPES.UPDATE_SUCCESS'),
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.buscarTiposDeServico();
      }),
      catchError(error => {
        let msgErro = error.error;
        if (error.error === "No changes detected! TaskType not updated!") {
          msgErro = this.translate.instant('SERVICE-TYPES.NO_CHANGES_DETECTED');
        }
        if (error.error === "TaskType not found!") {
          msgErro = this.translate.instant('SERVICE-TYPES.NOT_FOUND');
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

  validarCampos(tipoServico: TipoServicoModel) {
    if (tipoServico.taskTypeName === null || tipoServico.taskTypeName.trim() === ""
      || tipoServico.taskTypeName === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.REQUIRED_NAME'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.taskTypeDescription === null || tipoServico.taskTypeDescription.trim() === ""
      || tipoServico.taskTypeDescription === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.REQUIRED_DESCRIPTION'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.parameter0Name === null || tipoServico.parameter0Name.trim() === ""
      || tipoServico.parameter0Name === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.REQUIRED_FIRST_PARAM'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.parameter1Name === null || tipoServico.parameter1Name.trim() === ""
      || tipoServico.parameter1Name === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.REQUIRED_SECOND_PARAM'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.parameter2Name === null || tipoServico.parameter2Name.trim() === ""
      || tipoServico.parameter2Name === undefined) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.REQUIRED_THIRD_PARAM'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.taskTypeName.length < 6 || tipoServico.taskTypeName.length > 254) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.NAME_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter0Name.length < 3 || tipoServico.parameter0Name.length > 254) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.FIRST_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter1Name.length < 3 || tipoServico.parameter1Name.length > 254) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.SECOND_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter2Name.length < 3 || tipoServico.parameter2Name.length > 254) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.THIRD_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter3Name !== undefined && (tipoServico.parameter3Name!.length < 3 || tipoServico.parameter3Name!.length > 254)) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.FOURTH_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter4Name !== undefined && (tipoServico.parameter4Name!.length < 3 || tipoServico.parameter4Name!.length > 254)) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.FIFTH_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter5Name !== undefined && (tipoServico.parameter5Name!.length < 3 || tipoServico.parameter5Name!.length > 254)) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.SIXTH_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter6Name !== undefined && (tipoServico.parameter6Name!.length < 3 || tipoServico.parameter6Name!.length > 254)) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.SEVENTH_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter7Name !== undefined && (tipoServico.parameter7Name!.length < 3 || tipoServico.parameter7Name!.length > 254)) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.EIGHTH_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter8Name !== undefined && (tipoServico.parameter8Name!.length < 3 || tipoServico.parameter8Name!.length > 254)) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.NINTH_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter9Name !== undefined && (tipoServico.parameter9Name!.length < 3 || tipoServico.parameter9Name!.length > 254)) {
      Swal.fire({
        text: this.translate.instant('SERVICE-TYPES.TENTH_PARAM_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    return true;
  }

  visualizarDetalhes(tipoDeServico: TipoServicoModel) {
    this.tipoServicoModel = JSON.parse(JSON.stringify(tipoDeServico)); //Clonando objeto e não a sua referência
    this.additionalParameters = [];
    for (let i = 3; i < 10; i++) {
      if (tipoDeServico['parameter' + i + 'Name'] !== undefined && 
        tipoDeServico['parameter' + i + 'Name'] !== '' &&
        tipoDeServico['parameter' + i + 'Name'] !== null) {
        this.additionalParameters.push(i);
      }
    }
    this.renderModalVisualizar = true;
    Swal.fire({
      title: this.translate.instant('SERVICE-TYPES.DETAILS_TITLE'),
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('SERVICE-TYPES.EDIT_BUTTON'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalEditarTipoDeServico(tipoDeServico);
      }
    });
  }

  modalEditarTipoDeServico(tipoDeServico: TipoServicoModel) {
    this.indDesabilitaCampos = false;
    this.tipoServicoModel = JSON.parse(JSON.stringify(tipoDeServico)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: this.translate.instant('SERVICE-TYPES.EDIT_TITLE'),
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('SERVICE-TYPES.SAVE_BUTTON'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('SERVICE-TYPES.CANCEL_BUTTON'),
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.atualizarTipoDeServico(this.tipoServicoModel);
      } else if (result.isDismissed) {
        this.tipoServicoModel = new TipoServicoModel();
      }
    });
  }

  excluirTipoDeServico(id: number) {
    Swal.fire({
      title: this.translate.instant('SERVICE-TYPES.DELETE_TITLE'),
      html: this.translate.instant('SERVICE-TYPES.DELETE_CONFIRMATION_HTML'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('SERVICE-TYPES.CONFIRM_DELETE_BUTTON'),
      confirmButtonColor: 'red',
      cancelButtonText: this.translate.instant('SERVICE-TYPES.CANCEL_BUTTON'),
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoDeServicoService.excluirTipoDeServico(id).pipe(
          tap(retorno => {
            Swal.fire({
              text: this.translate.instant('SERVICE-TYPES.DELETE_SUCCESS_MESSAGE'),
              icon: "success",
              showConfirmButton: false,
              timer: 3000
            });
            this.buscarTiposDeServico();
          }),
          catchError(error => {
            let msgErro = error.error;
            if (error.error === "TaskType has related tasks! Cannot delete!") {
              msgErro = this.translate.instant('SERVICE-TYPES.DELETE_ERROR_RELATED_TASKS');
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
    this.tipoServicoModel = new TipoServicoModel();
    this.cadastroTipoDeServico = new TipoServicoModel();
    this.listaTipoDeServico = [];
    this.listaUnidadesDeMedida = [];
    this.filtroSelecionado = null;
    this.additionalParameters = [];
    this.buscarTiposDeServico();
    this.buscarUnidadesDeMedida();
  }

}