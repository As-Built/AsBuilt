import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { catchError, firstValueFrom, tap } from 'rxjs';
import { of } from 'rxjs';
import { LocalServicoModel } from './model/local-servico.model';
import { LocalServicoService } from './service/local-servico.service';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  construtoraSelecionada: ConstrutoraModel = new ConstrutoraModel();
  listaCentrosDeCustoFiltrados: CentroCustoModel[] = [];
  displayedColumns: string[] = ["acoes", "costCenter", "locationGroup", 'subGroup1', 'subGroup2', 'subGroup3'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
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

  constructor(
    private localServicoService: LocalServicoService,
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buscarConstrutoras();
    this.buscarCentrosDeCusto();
    this.filtrarDados();
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
    this.filtrarDados();
  }

  onFiltroCostCenterChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroCentroCustoSelecionado = null;
    } else {
      this.filtroCentroCustoSelecionado = novoFiltro;
    }
    this.filtroLocationGroup = null;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.filtrarDados();
  }

  onFiltroLocationGroupChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroLocationGroup = null;
    } else {
      this.filtroLocationGroup = novoFiltro;
    }
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.filtrarDados();
  }

  onFiltroSubGroup1Change(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSubGroup1 = null;
    } else {
      this.filtroSubGroup1 = novoFiltro;
    }
    this.filtroSubGroup2 = null;
    this.filtrarDados();
  }
  
  onFiltroSubGroup2Change(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSubGroup2 = null;
    } else {
      this.filtroSubGroup2 = novoFiltro;
    }
    this.filtrarDados();
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
    } else {
      this.listaLocalServicoFiltrada = [...this.listaLocalServico];
    }
  
    if (this.filtroCentroCustoSelecionado) {
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.costCenter.costCenterName === this.filtroCentroCustoSelecionado);
      
      const uniqueLocationGroups: { [key: string]: LocalServicoModel } = {}; //Adiciona um index a consulta para não trazer valores repetidos
      this.listaLocalServicoFiltrada.forEach(localServico => {
        uniqueLocationGroups[localServico.locationGroup] = localServico;
      });
      this.listaLocationGroupFiltradaConsulta = Object.values(uniqueLocationGroups);
    }

    if (this.filtroLocationGroup) {
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
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => localServico.subGroup2 === this.filtroSubGroup2);
    
      const uniqueLocationSubGroups3: { [key: string]: string } = {};
      this.listaLocalServicoFiltrada.forEach(localServico => {
        if (localServico.subGroup3) {
          uniqueLocationSubGroups3[localServico.subGroup3] = localServico.subGroup3;
        }
      });
    }
  }
  

  async buscarLocais() {
    try {
      this.spinner.show();
      const locaisServico: any = await firstValueFrom(this.localServicoService.listarLocais());
      this.listaLocalServico = locaisServico;
      this.filtrarDados();
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

  async buscarCentrosDeCusto() {
    try {
      const centros: any = await firstValueFrom(this.centroCustoService.listarCentrosDeCusto());
      this.listaCentrosDeCusto = centros;
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.isCadastroLocalServico = !this.isCadastroLocalServico;
    if (!this.isCadastroLocalServico) {
      this.buscarLocais();
    }
    this.cadastroLocalServico = new LocalServicoModel();
  }

  cadastrarLocalServico() {
    if (!this.validarCampos(this.cadastroLocalServico)){
      return;
    };
    this.spinner.show();
    this.localServicoService.cadastrarLocal(this.cadastroLocalServico).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.cadastroLocalServico = new LocalServicoModel();
      }),
      catchError(error => {
        this.spinner.hide();
        if (error.error == "Location already exists") {
          Swal.fire({
            text: "Este local de serviço já está cadastrado!",
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

  atualizarLocalServico(local: LocalServicoModel) {
    if (!this.validarCampos(local)) {
      return;
    }
    this.spinner.show();
    this.localServicoService.atualizarLocal(local).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: "Atualização realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.buscarLocais();
      }),
      catchError(error => {
        this.spinner.hide();
        let msgErro = error.error;
        if (error.error === "No changes detected! Location not updated!") {
          msgErro = "Nenhuma alteração detectada! Local não atualizado!";
        }
        if (error.error === "Location not found!") {
          msgErro = "Local não encontrado!";
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
    return true;
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
        this.spinner.show();
        this.localServicoService.excluirLocal(id).pipe(
          tap(retorno => {
            this.spinner.hide();
            Swal.fire({
              text: "Local de Serviço excluído com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 3000
            });
            this.buscarLocais();
          }),
          catchError(error => {
            this.spinner.hide();
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

  limparCampos() {
    this.localServicoModel = new LocalServicoModel();
    this.cadastroLocalServico = new LocalServicoModel();
    this.listaLocalServico = [];
    this.listaCentrosDeCusto = [];
    this.filtroCentroCustoSelecionado = null;
    this.listaLocalServicoFiltrada = [];
    this.listaCentrosDeCustoFiltradaConsulta = [];
    this.filtroLocationGroup = null;
    this.listaLocationGroupFiltradaConsulta = []
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.listaSubGroup1FiltradaConsulta = [];
    this.listaSubGroup2FiltradaConsulta = [];
    this.buscarLocais();
    this.buscarCentrosDeCusto();
    this.filtrarDados();
  }

}