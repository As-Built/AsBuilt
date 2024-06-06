import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UnidadeMedidaModel } from '../shared/model/unidade-medida.model';
import { UnidadeMedidaService } from './service/unidade-medida.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unidade-medida',
  templateUrl: './unidade-medida.component.html',
  styleUrls: ['./unidade-medida.component.scss']
})
export class UnidadeMedidaComponent implements OnInit {

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
    private unidadeDeMedidaService: UnidadeMedidaService
  ) { }

  ngOnInit(): void {
    this.buscarUnidadesDeMedida();
  }


  async buscarUnidadesDeMedida() {
    try {
      const centrosDeCusto: any = await firstValueFrom(this.unidadeDeMedidaService.listarUnidadesDeMedida());
      this.listaUnidadeDeMedida = centrosDeCusto;
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.buscarUnidadesDeMedida();
    this.isCadastroUnidade = !this.isCadastroUnidade;
    this.cadastroUnidadeDeMedida = new UnidadeMedidaModel();
  }

  cadastrarUnidadeDeMedida() {
    if (!this.validarCampos(this.cadastroUnidadeDeMedida)) {
      return;
    };
    this.unidadeDeMedidaService.cadastrarUnidadesDeMedida(this.cadastroUnidadeDeMedida).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.cadastroUnidadeDeMedida = new UnidadeMedidaModel();
      }),
      catchError(error => {
        if (error.error == "Unit Measurement already exists") {
          Swal.fire({
            text: "Já existe uma unidade de medida com essa sigla!",
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
        text: "O campo 'Sigla' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.description === null || unidadeDeMedida.description.trim() === ""
      || unidadeDeMedida.description === undefined) {
      Swal.fire({
        text: "O campo 'Descrição' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length < 2) {
      Swal.fire({
        text: "O campo 'Sigla da Unidade de Medida' deve ter no mínimo 2 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length > 4) {
      Swal.fire({
        text: "O campo 'Sigla da Unidade de Medida' deve ter no máximo 4 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length < 6) {
      Swal.fire({
        text: "O campo 'Descrição da Unidade de Medida' deve ter no mínimo 6 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (unidadeDeMedida.name.length > 254) {
      Swal.fire({
        text: "O campo 'Descrição da Unidade de Medida' deve ter no máximo 254 caracteres!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    return true;
  }

}