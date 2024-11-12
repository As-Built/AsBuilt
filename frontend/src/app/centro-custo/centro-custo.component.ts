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
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

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
  displayedColumns: string[] = ["acoes", "costCenterName", 'builder', 'valueUndertaken', 'expectedBudget'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  isCadastroCentroCusto = true;

  constructor(
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.buscarConstrutoras();
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
      this.spinner.show();
      const centrosDeCusto: any = await firstValueFrom(this.centroCustoService.listarCentrosDeCusto());
      this.listaCentrosDeCusto = centrosDeCusto;
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.isCadastroCentroCusto = !this.isCadastroCentroCusto;
    if (!this.isCadastroCentroCusto) {
      this.buscarCentroDeCusto();
    }
  }

  cadastrarCentroDeCusto() {
    if (!this.validarCampos(this.cadastroCentroCusto)) {
      return;
    };
    this.spinner.show();
    this.centroCustoService.cadastrarCentroDeCusto(this.cadastroCentroCusto).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('COST-CENTER.SUCCESS-MESSAGE'),
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.cadastroCentroCusto = new CentroCustoModel();
      }),
      catchError(error => {
        this.spinner.hide();
        if (error.error == "Cost Center already exists") {
          Swal.fire({
            text: this.translate.instant('COST-CENTER.NAME-EXISTS'),
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
        }
        if (error.error == "A Cost Center with the same address already exists!") {
          Swal.fire({
            text: this.translate.instant('COST-CENTER.ADDRESS-EXISTS'),
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
      return;    
    };
    this.spinner.show();
    this.centroCustoService.atualizarDadosCentroDeCusto(centro).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('COST-CENTER.UPDATE-SUCCESS'),
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.buscarConstrutoras();
      }),
      catchError(error => {
        this.spinner.hide();
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
        text: this.translate.instant('COST-CENTER.NAME-REQUIRED'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (centro.costCenterAddress.street === null || centro.costCenterAddress.street.trim() === ""
      || centro.costCenterAddress.street === undefined) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.ADDRESS-REQUIRED'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (centro.costCenterAddress.postalCode === null || centro.costCenterAddress.postalCode.trim() === ""
      || centro.costCenterAddress.postalCode === undefined) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.ZIP-REQUIRED'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (centro.costCenterAddress.city === null || centro.costCenterAddress.city.trim() === ""
      || centro.costCenterAddress.city === undefined) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.CITY-REQUIRED'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (centro.costCenterAddress.state === null || centro.costCenterAddress.state.trim() === ""
      || centro.costCenterAddress.state === undefined) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.STATE-REQUIRED'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.builder === null || centro.builder === undefined) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.BUILDER-REQUIRED'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.costCenterName.length < 6) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.NAME-MIN-CHARS'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.costCenterName.length > 254) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.NAME-MAX-CHARS'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.costCenterAddress.postalCode.length != 9) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.ZIP-CHARS'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.costCenterAddress.street.length < 6) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.ADDRESS-MIN-CHARS'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.costCenterAddress.street.length > 254) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.ADDRESS-MAX-CHARS'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.costCenterAddress.city.length < 6) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.CITY-MIN-CHARS'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (centro.costCenterAddress.city.length > 254) {
      Swal.fire({
        text: this.translate.instant('COST-CENTER.CITY-MAX-CHARS'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    return true;
  }

  visualizarDetalhes(centro: CentroCustoModel) {
    this.centroCustoModel = JSON.parse(JSON.stringify(centro)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: this.translate.instant('COST-CENTER.DETAILS'),
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('COST-CENTER.EDIT'),
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
      title: this.translate.instant('COST-CENTER.EDIT'),
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('COST-CENTER.SAVE'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('COST-CENTER.CANCEL'),
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
      title: this.translate.instant('COST-CENTER.DELETE-TITLE'),
      html: this.translate.instant('COST-CENTER.DELETE-CONFIRMATION', { costCenterName: costCenterName }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('COST-CENTER.CONFIRM-DELETE'),
      confirmButtonColor: 'red',
      cancelButtonText: this.translate.instant('COST-CENTER.CANCEL'),
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.centroCustoService.excluirCentroDeCusto(id).pipe(
          tap(retorno => {
            this.spinner.hide();
            Swal.fire({
              text: this.translate.instant('COST-CENTER.DELETE-SUCCESS'),
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            this.buscarCentroDeCusto();
          }),
          catchError(error => {
            this.spinner.hide();
            let msgErro = error.error;
            if (error.error === "This Builder has open tasks related to it, please delete the open tasks first!") {
              msgErro = this.translate.instant('COST-CENTER.OPEN-TASKS-ERROR');
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

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  limparCampos() {
    this.centroCustoModel = new CentroCustoModel();
    this.cadastroCentroCusto = new CentroCustoModel();
    this.listaConstrutoras = [];
    this.listaCentrosDeCusto = [];
    this.buscarConstrutoras();
    this.buscarCentroDeCusto();
  }

}