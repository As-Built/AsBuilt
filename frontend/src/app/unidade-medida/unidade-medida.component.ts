import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UnidadeMedidaModel } from '../shared/model/unidade-medida.model';
import { UnidadeMedidaService } from './service/unidade-medida.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-unidade-medida',
  templateUrl: './unidade-medida.component.html',
  styleUrls: ['./unidade-medida.component.scss']
})
export class UnidadeMedidaComponent {

  @ViewChild('modalEditarUnidade', { static: true })
  modalEditarUnidade!: ElementRef;

  unidadeDeMedidaModel = new UnidadeMedidaModel();
  cadastroUnidadeDeMedida = new UnidadeMedidaModel();
  listaUnidadeDeMedida: UnidadeMedidaModel[] = [];
  displayedColumns: string[] = ["name", 'description'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  isCadastroUnidade = true;

  constructor(
    private unidadeDeMedidaService: UnidadeMedidaService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  async buscarUnidadesDeMedida() {
    try {
      this.spinner.show();
      const centrosDeCusto: any = await firstValueFrom(this.unidadeDeMedidaService.listarUnidadesDeMedida());
      this.listaUnidadeDeMedida = centrosDeCusto;
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.isCadastroUnidade = !this.isCadastroUnidade;
    if (!this.isCadastroUnidade) {
      this.buscarUnidadesDeMedida();
    }
    this.cadastroUnidadeDeMedida = new UnidadeMedidaModel();
  }

  cadastrarUnidadeDeMedida() {
    if (!this.validarCampos(this.cadastroUnidadeDeMedida)) {
      return;
    };
    this.spinner.show();
    this.unidadeDeMedidaService.cadastrarUnidadesDeMedida(this.cadastroUnidadeDeMedida).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('UNIT-OF-MEASURE.CADASTRO_SUCESSO'),
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.cadastroUnidadeDeMedida = new UnidadeMedidaModel();
      }),
      catchError(error => {
        this.spinner.hide();
        if (error.error == "Unit Measurement already exists") {
          Swal.fire({
            text: this.translate.instant('UNIT-OF-MEASURE.UNIDADE_EXISTENTE'),
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
        }
        return of();
      })
    ).subscribe();
  }


  validarCampos(unidadeDeMedida: UnidadeMedidaModel) {
    if (unidadeDeMedida.name === null || unidadeDeMedida.name.trim() === ""
      || unidadeDeMedida.name === undefined) {
      Swal.fire({
        text: this.translate.instant('UNIT-OF-MEASURE.SIGLA_OBRIGATORIA'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.description === null || unidadeDeMedida.description.trim() === ""
      || unidadeDeMedida.description === undefined) {
      Swal.fire({
        text: this.translate.instant('UNIT-OF-MEASURE.DESCRICAO_OBRIGATORIA'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length < 2) {
      Swal.fire({
        text: this.translate.instant('UNIT-OF-MEASURE.SIGLA_MIN_CARACTERES'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length > 4) {
      Swal.fire({
        text: this.translate.instant('UNIT-OF-MEASURE.SIGLA_MAX_CARACTERES'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length < 6) {
      Swal.fire({
        text: this.translate.instant('UNIT-OF-MEASURE.DESCRICAO_MIN_CARACTERES'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length > 254) {
      Swal.fire({
        text: this.translate.instant('UNIT-OF-MEASURE.DESCRICAO_MAX_CARACTERES'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    return true;
  }

}