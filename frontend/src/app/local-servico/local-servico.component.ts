import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { of } from 'rxjs';
import { LocalServicoModel } from './model/local-servico.model';
import { LocalServicoService } from './service/local-servico.service';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';

@Component({
  selector: 'app-local-servico',
  templateUrl: './local-servico.component.html',
  styleUrls: ['./local-servico.component.scss']
})
export class LocalServicoComponent implements OnInit {

  @ViewChild('modalEditarDetalhes', { static: true })
  modalEditarDetalhes!: ElementRef;

  localServicoModel = new LocalServicoModel();
  cadastroLocalServico = new LocalServicoModel();
  listaLocalServico: LocalServicoModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  displayedColumns: string[] = ["acoes", "costCenter", "locationGroup", 'subGroup1', 'subGroup2', 'subGroup3'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  isCadastroLocalServico = true;

  constructor(
    private localServicoService: LocalServicoService,
    private centroCustoService: CentroCustoService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.buscarLocais();
    this.buscarCentrosDeCusto();
  }

  async buscarLocais() {
    try {
      const locaisServico: any = await firstValueFrom(this.localServicoService.listarLocais());
      this.listaLocalServico = locaisServico;
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

  mudarAba() {
    this.buscarLocais();
    this.isCadastroLocalServico = !this.isCadastroLocalServico;
  }

  cadastrarLocalServico() {
    this.validarCampos(this.cadastroLocalServico);
    this.localServicoService.cadastrarLocal(this.cadastroLocalServico).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
      }),
      catchError(error => {
        if (error.error == "Location already exists") {
          Swal.fire({
            text: "Este local de serviço já está cadastrado!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000
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

  atualizarLocalServico(local: LocalServicoModel) {
    this.validarCampos(local);
    this.localServicoService.atualizarLocal(local).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Atualização realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.buscarLocais();
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

  validarCampos(local: LocalServicoModel) {
    if (local.locationGroup === null || local.locationGroup.trim() === ""
      || local.locationGroup === undefined) {
      Swal.fire({
        text: "É obrigatório informar ao menos o 1º nível da localização!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
  }

  modalEditarLocalServico(local: LocalServicoModel) {
    this.indDesabilitaCampos = false;
    this.localServicoModel = JSON.parse(JSON.stringify(local)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: 'Editar Local de Serviço',
      html: this.modalEditarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Salvar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.atualizarLocalServico(this.localServicoModel);
      } else if (result.isDismissed) {
        this.localServicoModel = new LocalServicoModel();
      }
    });
  }

  excluirLocalServico(id: number) {
    Swal.fire({
      title: 'Excluir Local de Serviço?',
      html: `Deseja realmente excluir o Local de Serviço? <br>Essa ação é irreverssível!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.localServicoService.excluirLocal(id).pipe(
          tap(retorno => {
            Swal.fire({
              text: "Local de Serviço excluído com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            this.buscarLocais();
          }),
          catchError(error => {
            let msgErro = error.error;
            if (error.error === "This Location has tasks related to it, please delete the tasks first!") {
              msgErro = "Esse local possui serviços em aberto relacionados a ele, por favor, exclua os serviços primeiro!";
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