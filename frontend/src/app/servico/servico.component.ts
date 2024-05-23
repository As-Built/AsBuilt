import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServicoModel } from './model/servico.model';
import { ServicoService } from './service/servico.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { LocalServicoModel } from '../local-servico/model/local-servico.model';
import { LocalServicoService } from '../local-servico/service/local-servico.service';
import { TiposServicoService } from '../tipo-servico/service/tipos-servico.service';
import { TipoServicoModel } from '../tipo-servico/model/tipo-servico.model';


@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss']
})
export class ServicoComponent implements OnInit {

  @ViewChild('modalVisualizarDetalhes', { static: true })
  modalVisualizarDetalhes!: ElementRef;

  servicoModel = new ServicoModel();
  cadastroServico = new ServicoModel();
  listaServicos: ServicoModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  listaLocais: LocalServicoModel[] = [];
  listaTiposServico: TipoServicoModel[] = [];
  displayedColumns: string[] = ["acoes", "costCenter", "locationGroup", 'subGroup1', 'subGroup2', 'subGroup3'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  isCadastroServico = true;
  filtroSelecionado: string | null = null;
  listaServicosFiltrada: ServicoModel[] = [];
  listaCentrosDeCustoFiltrada: CentroCustoModel[] = [];
  // filtroLocationGroup: string | null = null;
  // listaLocationGroup: string[] = [];
  // filtroSubGroup1: string | null = null;
  // filtroSubGroup2: string | null = null;
  // listaSubGroup1: string[] = [];
  // listaSubGroup2: string[] = [];

  constructor(
    private servicoService: ServicoService,
    private centroCustoService: CentroCustoService,
    private localService: LocalServicoService,
    private tiposServicoService: TiposServicoService
  ) { }

  ngOnInit(): void {
    this.buscarServicos();
    this.buscarCentrosDeCusto();
    this.buscarLocais();
    this.buscarTiposServico();
    // this.filtrarDados();
  }

  onFiltroChange(event: Event) {
    const novoFiltro = (event.target as HTMLSelectElement).value;
    if (novoFiltro === 'Todos') {
      this.filtroSelecionado = null;
    } else {
      this.filtroSelecionado = novoFiltro;
    }
    // this.filtroLocationGroup = null;
    // this.filtroSubGroup1 = null;
    // this.filtroSubGroup2 = null;
    // this.filtrarDados();
  }

  // onFiltroLocationGroupChange(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroLocationGroup = null;
  //   } else {
  //     this.filtroLocationGroup = novoFiltro;
  //   }
  //   this.filtroSubGroup1 = null;
  //   this.filtroSubGroup2 = null;
  //   this.filtrarDados();
  // }

  // onFiltroSubGroup1Change(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroSubGroup1 = null;
  //   } else {
  //     this.filtroSubGroup1 = novoFiltro;
  //   }
  //   this.filtroSubGroup2 = null;
  //   this.filtrarDados();
  // }

  // onFiltroSubGroup2Change(event: Event) {
  //   const novoFiltro = (event.target as HTMLSelectElement).value;
  //   if (novoFiltro === 'Todos') {
  //     this.filtroSubGroup2 = null;
  //   } else {
  //     this.filtroSubGroup2 = novoFiltro;
  //   }
  //   this.filtrarDados();
  // }

  // filtrarDados() {
  //   const costCenters = this.listaServicos.map(item => item.costCenter);
  //   this.listaCentrosDeCustoFiltrada = Array.from(new Set(costCenters.map(cc => cc.costCenterName)))
  //     .map(name => {
  //       return costCenters.find(cc => cc.costCenterName === name)
  //     })
  //     .filter((cc): cc is CentroCustoModel => Boolean(cc));

  //   if (this.filtroSelecionado) {
  //     this.listaServicosFiltrada = this.listaServicos.filter(localServico => 
  //       localServico.costCenter.costCenterName === this.filtroSelecionado
  //     );
  //   } else {
  //     this.listaServicosFiltrada = [...this.listaServicos];
  //   }

  //   this.listaLocationGroup = Array.from(new Set(this.listaServicosFiltrada.map(ls => ls.locationGroup)));

  //   if (this.filtroLocationGroup) {
  //     this.listaServicosFiltrada = this.listaServicosFiltrada.filter(localServico => 
  //       localServico.locationGroup === this.filtroLocationGroup
  //     );
  //   }
  //   this.listaSubGroup1 = Array.from(new Set(this.listaServicosFiltrada.map(ls => ls.subGroup1).filter((sg): sg is string => sg !== undefined)));
  //   this.listaSubGroup2 = Array.from(new Set(this.listaServicosFiltrada.map(ls => ls.subGroup2).filter((sg): sg is string => sg !== undefined)));

  //   if (this.filtroSubGroup1) {
  //     this.listaServicosFiltrada = this.listaServicosFiltrada.filter(localServico => 
  //       localServico.subGroup1 === this.filtroSubGroup1
  //     );
  //   }

  //   if (this.filtroSubGroup2) {
  //     this.listaServicosFiltrada = this.listaServicosFiltrada.filter(localServico => 
  //       localServico.subGroup2 === this.filtroSubGroup2
  //     );
  //   }
  // }


  async buscarServicos() {
    try {
      const servicos: any = await firstValueFrom(this.servicoService.listarServicos());
      this.listaServicos = servicos;
      // this.filtrarDados();
    } catch (error) {
      console.error(error);
    }
  }

  async buscarLocais() {
    try {
      const locais: any = await firstValueFrom(this.localService.listarLocais());
      this.listaLocais = locais;
      // this.filtrarDados();
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

  async buscarTiposServico() {
    try {
      const tipos: any = await firstValueFrom(this.tiposServicoService.listarTiposDeServico());
      this.listaTiposServico = tipos;
    } catch (error) {
      console.error(error);
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

  mudarAba() {
    this.buscarServicos();
    this.isCadastroServico = !this.isCadastroServico;
    this.cadastroServico = new ServicoModel();
  }

  cadastrarServico() {
    this.validarCampos(this.cadastroServico);
    this.servicoService.cadastrarServico(this.cadastroServico).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.cadastroServico = new ServicoModel();
      }),
      catchError(error => {
        if (error.error == "Task already exists") {
          Swal.fire({
            text: "Já existe um serviço cadastrado neste mesmo local e com o mesmo tipo de serviço!",
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
    this.validarCampos(servico);
    this.servicoService.atualizarServico(servico).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Atualização realizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.buscarServicos();
      }),
      catchError(error => {
        let msgErro = error.error;
        if (error.error === "No changes detected! Task not updated!") {
          msgErro = "Nenhuma alteração detectada! Serviço não atualizado!";
        }
        if (error.error === "Task not found!") {
          msgErro = "Serviço não encontrado!";
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
        text: "É obrigatório informar o centro de custo!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (servico.taskType === null || servico.taskType === undefined) {
      Swal.fire({
        text: "É obrigatório informar o tipo de serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (servico.taskLocation === null || servico.taskLocation === undefined) {
      Swal.fire({
        text: "É obrigatório informar o local de execução do serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (servico.dimension === null || servico.dimension == 0
      || servico.dimension === undefined) {
      Swal.fire({
        text: "É obrigatório informar a dimensão do serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (servico.expectedStartDate === null || servico.taskLocation === undefined) {
      Swal.fire({
        text: "É obrigatório informar a data de início prevista para o serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (servico.expectedEndDate === null || servico.expectedEndDate === undefined) {
      Swal.fire({
        text: "É obrigatório informar a data de final prevista para o serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (servico.expectedEndDate < servico.expectedEndDate) {
      Swal.fire({
        text: "A data de início previsto não pode ser posterior a data de final prevista!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (servico.unitaryValue === null || servico.unitaryValue === undefined
      || servico.unitaryValue === 0) {
      Swal.fire({
        text: "É obrigatório informar o valor unitário do serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
  }

  visualizarDetalhes(servico: ServicoModel) {
    this.servicoModel = JSON.parse(JSON.stringify(servico)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: 'Detalhes do Serviço',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Editar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalEditarServico(servico);
      }
    });
  }

  modalEditarServico(servico: ServicoModel) {
    this.indDesabilitaCampos = false;
    this.servicoModel = JSON.parse(JSON.stringify(servico)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: 'Editar Local de Serviço',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Salvar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.atualizarServico(this.servicoModel);
      } else if (result.isDismissed) {
        this.servicoModel = new ServicoModel();
      }
    });
  }

  excluirServico(id: number) {
    Swal.fire({
      title: 'Excluir Serviço?',
      html: `Deseja realmente excluir o Serviço? <br>Essa ação é irreverssível!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicoService.excluirServico(id).pipe(
          tap(retorno => {
            Swal.fire({
              text: "Serviço excluído com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 3000
            });
            this.buscarServicos();
          }),
          catchError(error => {
            let msgErro = error.error;
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