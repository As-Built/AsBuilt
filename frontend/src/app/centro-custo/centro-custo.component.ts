import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CentroCustoModel } from './model/centro-custo.model';
import { CentroCustoService } from './service/centro-custo.service';
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
import { EnderecoModel } from '../shared/model/endereco.model';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-centro-custo',
  templateUrl: './centro-custo.component.html',
  styleUrls: ['./centro-custo.component.scss']
})
export class CentroCustoComponent implements OnInit {

  @ViewChild('modalVisualizarDetalhes', { static: true })
  modalVisualizarDetalhes!: ElementRef;

  centroCustoModel = new CentroCustoModel();
  cadastroCentroCusto = new CentroCustoModel();
  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  estadosBrasileiros = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  displayedColumns: string[] = ["acoes", "costCenterName", 'builder', 'valueUndertaken'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  isCadastroCentroCusto = true;

  constructor(
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.buscarConstrutoras();
    this.buscarCentroDeCusto();
  }

  get selectedConstrutoraIndex(): number {
    return this.listaConstrutoras.indexOf(this.cadastroCentroCusto.builder);
  }

  set selectedConstrutoraIndex(index: number) {
    this.cadastroCentroCusto.builder = this.listaConstrutoras[index];
  }

  getAddress(cep: string) {
    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((endereco: any) => {
      this.cadastroCentroCusto.costCenterAddress.postalCode = endereco.cep;
      this.cadastroCentroCusto.costCenterAddress.street = endereco.logradouro;
      this.cadastroCentroCusto.costCenterAddress.city = endereco.localidade;
      this.cadastroCentroCusto.costCenterAddress.state = endereco.uf;
    })
  }

  async buscarConstrutoras() {
    try {
      const construtoras: any = await firstValueFrom(this.construtoraService.listarConstrutoras());
      this.listaConstrutoras = construtoras;
    } catch (error) {
      console.error(error);
    }
  }

  async buscarCentroDeCusto() {
    try {
      const centrosDeCusto: any = await firstValueFrom(this.centroCustoService.listarCentrosDeCusto());
      this.listaCentrosDeCusto = centrosDeCusto;
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.buscarCentroDeCusto();
    this.isCadastroCentroCusto = !this.isCadastroCentroCusto;
  }

  cadastrarCentroDeCusto() {
    if (!this.validarCampos(this.cadastroCentroCusto)) {
      return;
    };
    this.centroCustoService.cadastrarCentroDeCusto(this.cadastroCentroCusto).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
      }),
      catchError(error => {
        if (error.error == "Cost Center already exists") {
          Swal.fire({
            text: "Já existe um centro de custo com esse nome!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
        }
        if (error.error == "A Cost Center with the same address already exists!") {
          Swal.fire({
            text: "Já existe um centro de custo cadastrado neste endereço!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
        }
        return of();
      })
    ).subscribe();
  }

  atualizarDadosCentroDeCusto(centro: CentroCustoModel) {
    if (!this.validarCampos(centro)) {
      return;    };
    this.centroCustoService.atualizarDadosCentroDeCusto(centro).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Atualização realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.buscarConstrutoras();
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
  }

  validarCampos(centro: CentroCustoModel) {
    if (centro.costCenterName === null || centro.costCenterName.trim() === ""
      || centro.costCenterName === undefined) {
      Swal.fire({
        text: "O campo 'Nome do Centro de Custo' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (centro.costCenterAddress.street === null || centro.costCenterAddress.street.trim() === ""
      || centro.costCenterAddress.street === undefined) {
      Swal.fire({
        text: "O campo 'Logradouro' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (centro.costCenterAddress.postalCode === null || centro.costCenterAddress.postalCode.trim() === ""
      || centro.costCenterAddress.postalCode === undefined) {
      Swal.fire({
        text: "O campo 'CEP' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (centro.costCenterAddress.city === null || centro.costCenterAddress.city.trim() === ""
      || centro.costCenterAddress.city === undefined) {
      Swal.fire({
        text: "O campo 'Cidade' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (centro.costCenterAddress.state === null || centro.costCenterAddress.state.trim() === ""
      || centro.costCenterAddress.state === undefined) {
      Swal.fire({
        text: "O campo 'UF' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (centro.builder === null || centro.builder === undefined) {
      Swal.fire({
        text: "O campo 'Construtora' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    return true;
  }

  visualizarDetalhes(centro: CentroCustoModel) {
    this.centroCustoModel = JSON.parse(JSON.stringify(centro)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: 'Detalhes do Centro de custo',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Editar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalEditarCentroDeCusto(centro);
      }
    });
  }

  modalEditarCentroDeCusto(centro: CentroCustoModel) {
    this.indDesabilitaCampos = false;
    this.centroCustoModel = JSON.parse(JSON.stringify(centro)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: 'Editar Centro de Custo',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Salvar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.atualizarDadosCentroDeCusto(this.centroCustoModel);
      } else if (result.isDismissed) {
        this.centroCustoModel = new CentroCustoModel();
      }
    });
  }

  excluirCentroDeCusto(id: number, costCenterName: string) {
    Swal.fire({
      title: 'Excluir Construtora?',
      html: `Deseja realmente excluir <b>${costCenterName}</b>? <br>Essa ação é irreverssível!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.centroCustoService.excluirCentroDeCusto(id).pipe(
          tap(retorno => {
            Swal.fire({
              text: "Centro de custo excluído com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            this.buscarCentroDeCusto();
          }),
          catchError(error => {
            let msgErro = error.error;
            if (error.error === "This Builder has open tasks related to it, please delete the open tasks first!") {
              msgErro = "Esse Centro de Custo possui serviços em aberto relacionados a ele, por favor, exclua os serviços primeiro!";
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

}