import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TipoServicoModel } from './model/tipo-servico.model';
import { TiposServicoService } from './service/tipos-servico.service';
import { UnidadeMedidaService } from '../unidade-medida/service/unidade-medida.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { UnidadeMedidaModel } from '../shared/model/unidade-medida.model';
import Swal from 'sweetalert2';

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
    private unidadeDeMedidaService: UnidadeMedidaService
  ) { }

  ngOnInit(): void {
    this.buscarTiposDeServico();
    this.buscarUnidadesDeMedida();
  }

  async buscarTiposDeServico() {
    try {
      const tiposDeServico: any = await firstValueFrom(this.tipoDeServicoService.listarTiposDeServico());
      this.listaTipoDeServico = tiposDeServico;
    } catch (error) {
      console.error(error);
    }
  }

  async buscarUnidadesDeMedida() {
    try {
      const unidadesDeMedida: any = await firstValueFrom(this.unidadeDeMedidaService.listarUnidadesDeMedida());
      this.listaUnidadesDeMedida = unidadesDeMedida;
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.buscarTiposDeServico();
    this.iscadastroTipoDeServico = !this.iscadastroTipoDeServico;
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
    this.tipoDeServicoService.cadastrarTipoDeServico(this.cadastroTipoDeServico).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.cadastroTipoDeServico = new TipoServicoModel();
        this.additionalParameters = [];
      }),
      catchError(error => {
        if (error.error == "TaskType already exists") {
          Swal.fire({
            text: "Este Tipo de Serviço já está cadastrado!",
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
          text: "Atualização realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.buscarTiposDeServico();
      }),
      catchError(error => {
        let msgErro = error.error;
        if (error.error === "No changes detected! TaskType not updated!") {
          msgErro = "Nenhuma alteração detectada! Tipo de Serviço não atualizado!";
        }
        if (error.error === "TaskType not found!") {
          msgErro = "Tipo de Serviço não encontrado!";
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
        text: "É obrigatório informar o nome do tipo de serviço",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.taskTypeDescription === null || tipoServico.taskTypeDescription.trim() === ""
      || tipoServico.taskTypeDescription === undefined) {
      Swal.fire({
        text: "É obrigatório informar a descrição do tipo de serviço",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.parameter0Name === null || tipoServico.parameter0Name.trim() === ""
      || tipoServico.parameter0Name === undefined) {
      Swal.fire({
        text: "É obrigatório informar o nome do primeiro parâmetro de avaliação deste tipo de serviço",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.parameter1Name === null || tipoServico.parameter1Name.trim() === ""
      || tipoServico.parameter1Name === undefined) {
      Swal.fire({
        text: "É obrigatório informar o nome do segundo parâmetro de avaliação deste tipo de serviço",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    if (tipoServico.parameter2Name === null || tipoServico.parameter2Name.trim() === ""
      || tipoServico.parameter2Name === undefined) {
      Swal.fire({
        text: "É obrigatório informar o nome do terceiro parâmetro de avaliação deste tipo de serviço",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.taskTypeName.length < 6) {
      Swal.fire({
        text: "O campo 'Nome' deve ter no mínimo 6 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.taskTypeName.length > 254) {
      Swal.fire({
        text: "O campo 'Nome' deve ter no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter0Name.length < 6) {
      Swal.fire({
        text: "O campo '1º Parâmetro de avaliação' deve ter no mínimo 6 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter0Name.length > 254) {
      Swal.fire({
        text: "O campo '1º Parâmetro de avaliação' deve ter no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter1Name.length < 6) {
      Swal.fire({
        text: "O campo '2º Parâmetro de avaliação' deve ter no mínimo 6 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter1Name.length > 254) {
      Swal.fire({
        text: "O campo '2º Parâmetro de avaliação' deve ter no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter2Name.length < 6) {
      Swal.fire({
        text: "O campo '3º Parâmetro de avaliação' deve ter no mínimo 6 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter2Name.length > 254) {
      Swal.fire({
        text: "O campo '3º Parâmetro de avaliação' deve ter no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (tipoServico.parameter3Name !== undefined && (tipoServico.parameter3Name!.length < 6 || tipoServico.parameter3Name!.length > 254)) {
      Swal.fire({
        text: "O campo '4º Parâmetro de avaliação' deve ter no mínimo 6 e no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter4Name !== undefined && (tipoServico.parameter4Name!.length < 6 || tipoServico.parameter4Name!.length > 254)) {
      Swal.fire({
        text: "O campo '5º Parâmetro de avaliação' deve ter no mínimo 6 e no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter5Name !== undefined && (tipoServico.parameter5Name!.length < 6 || tipoServico.parameter5Name!.length > 254)) {
      Swal.fire({
        text: "O campo '6º Parâmetro de avaliação' deve ter no mínimo 6 e no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter6Name !== undefined && (tipoServico.parameter6Name!.length < 6 || tipoServico.parameter6Name!.length > 254)) {
      Swal.fire({
        text: "O campo '7º Parâmetro de avaliação' deve ter no mínimo 6 e no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter7Name !== undefined && (tipoServico.parameter7Name!.length < 6 || tipoServico.parameter7Name!.length > 254)) {
      Swal.fire({
        text: "O campo '8º Parâmetro de avaliação' deve ter no mínimo 6 e no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter8Name !== undefined && (tipoServico.parameter8Name!.length < 6 || tipoServico.parameter8Name!.length > 254)) {
      Swal.fire({
        text: "O campo '9º Parâmetro de avaliação' deve ter no mínimo 6 e no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (tipoServico.parameter9Name !== undefined && (tipoServico.parameter9Name!.length < 6 || tipoServico.parameter9Name!.length > 254)) {
      Swal.fire({
        text: "O campo '10º Parâmetro de avaliação' deve ter no mínimo 6 e no máximo 254 caracteres!",
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
      title: 'Detalhes do Tipo de Serviço',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Editar',
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
      title: 'Editar Tipo de Serviço',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Salvar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
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
      title: 'Excluir Tipo de Serviço?',
      html: `Deseja realmente excluir o Tipo de Serviço? <br>Essa ação é irreverssível!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoDeServicoService.excluirTipoDeServico(id).pipe(
          tap(retorno => {
            Swal.fire({
              text: "Tipo de Serviço excluído com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 3000
            });
            this.buscarTiposDeServico();
          }),
          catchError(error => {
            let msgErro = error.error;
            if (error.error === "TaskType has related tasks! Cannot delete!") {
              msgErro = "Esse tipo de serviço possui serviços relacionados a ele. Não é possível excluí-lo!";
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