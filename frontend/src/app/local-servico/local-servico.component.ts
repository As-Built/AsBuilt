import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { of } from 'rxjs';
import { LocalServicoModel } from './model/local-servico.model';
import { LocalServicoService } from './service/local-servico.service';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { ConstrutoraService } from '../construtora/service/construtora.service';

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
  filtroSelecionado: string | null = null;
  listaLocalServicoFiltrada: LocalServicoModel[] = [];
  listaConstrutorasConsulta: ConstrutoraModel[] = [];
  listaCentrosDeCustoFiltradaConsulta: CentroCustoModel[] = [];
  construtoraFiltro: string | null = null;
  filtroLocationGroup: string | null = null;
  listaLocationGroup: string[] = [];
  filtroSubGroup1: string | null = null;
  filtroSubGroup2: string | null = null;
  listaSubGroup1: string[] = [];
  listaSubGroup2: string[] = [];

  constructor(
    private localServicoService: LocalServicoService,
    private centroCustoService: CentroCustoService,
    private construtoraService: ConstrutoraService,
  ) { }

  ngOnInit(): void {
    this.buscarLocais();
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
    this.filtroSelecionado = null;
    this.filtroLocationGroup = null;
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.filtrarDados();
  }

  onFiltroChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSelecionado = null;
    } else {
      this.filtroSelecionado = novoFiltro;
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
    this.listaConstrutorasConsulta = Array.from(new Set(construtoras.map(c => c.builderName)))
      .map(name => {
        return construtoras.find(c => c.builderName === name)
      })
      .filter((c): c is ConstrutoraModel => Boolean(c));

    if (this.filtroConstrutoraSelecionado) {
      this.listaLocalServicoFiltrada = this.listaLocalServico.filter(construtora => 
        construtora.costCenter.builder.builderName === this.filtroConstrutoraSelecionado
      );
    } else {
      this.listaLocalServicoFiltrada = [...this.listaLocalServico];
    }
    
    // const costCenters = this.listaLocalServico.map(item => item.costCenter);
    // this.listaCentrosDeCustoFiltradaConsulta = Array.from(new Set(costCenters.map(cc => cc.costCenterName)))
    //   .map(name => {
    //     return costCenters.find(cc => cc.costCenterName === name)
    //   })
    //   .filter((cc): cc is CentroCustoModel => Boolean(cc));

    this.listaCentrosDeCustoFiltradaConsulta = Array.from(new Set(this.listaLocalServicoFiltrada.map(ls => ls.costCenter)));

    
    if (this.filtroSelecionado) {
      this.listaLocalServicoFiltrada = this.listaLocalServico.filter(localServico => 
        localServico.costCenter.costCenterName === this.filtroSelecionado
      );
    } else {
      this.listaLocalServicoFiltrada = [...this.listaLocalServico];
    }
  
    this.listaLocationGroup = Array.from(new Set(this.listaLocalServicoFiltrada.map(ls => ls.locationGroup)));
  
    if (this.filtroLocationGroup) {
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => 
        localServico.locationGroup === this.filtroLocationGroup
      );
    }
    this.listaSubGroup1 = Array.from(new Set(this.listaLocalServicoFiltrada.map(ls => ls.subGroup1).filter((sg): sg is string => sg !== undefined)));
    this.listaSubGroup2 = Array.from(new Set(this.listaLocalServicoFiltrada.map(ls => ls.subGroup2).filter((sg): sg is string => sg !== undefined)));
  
    if (this.filtroSubGroup1) {
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => 
        localServico.subGroup1 === this.filtroSubGroup1
      );
    }
  
    if (this.filtroSubGroup2) {
      this.listaLocalServicoFiltrada = this.listaLocalServicoFiltrada.filter(localServico => 
        localServico.subGroup2 === this.filtroSubGroup2
      );
    }
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

  mudarAba() {
    this.buscarLocais();
    this.isCadastroLocalServico = !this.isCadastroLocalServico;
    this.cadastroLocalServico = new LocalServicoModel();
  }

  cadastrarLocalServico() {
    if (!this.validarCampos(this.cadastroLocalServico)){
      return;
    };
    this.localServicoService.cadastrarLocal(this.cadastroLocalServico).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.cadastroLocalServico = new LocalServicoModel();
      }),
      catchError(error => {
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
    this.localServicoService.atualizarLocal(local).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Atualização realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.buscarLocais();
      }),
      catchError(error => {
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
        this.localServicoService.excluirLocal(id).pipe(
          tap(retorno => {
            Swal.fire({
              text: "Local de Serviço excluído com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 3000
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

  limparCampos() {
    this.localServicoModel = new LocalServicoModel();
    this.cadastroLocalServico = new LocalServicoModel();
    this.listaLocalServico = [];
    this.listaCentrosDeCusto = [];
    this.filtroSelecionado = null;
    this.listaLocalServicoFiltrada = [];
    this.listaCentrosDeCustoFiltradaConsulta = [];
    this.filtroLocationGroup = null;
    this.listaLocationGroup = [];
    this.filtroSubGroup1 = null;
    this.filtroSubGroup2 = null;
    this.listaSubGroup1 = [];
    this.listaSubGroup2 = [];
    this.buscarLocais();
    this.buscarCentrosDeCusto();
    this.filtrarDados();
  }

}