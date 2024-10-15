import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServicoModel } from './model/servico.model';
import { ServicoService } from './service/servico.service';
import { CentroCustoModel } from '../centro-custo/model/centro-custo.model';
import { CentroCustoService } from '../centro-custo/service/centro-custo.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { LocalServicoModel } from '../local-servico/model/local-servico.model';
import { LocalServicoService } from '../local-servico/service/local-servico.service';
import { TiposServicoService } from '../tipo-servico/service/tipos-servico.service';
import { TipoServicoModel } from '../tipo-servico/model/tipo-servico.model';
import { ConstrutoraService } from '../construtora/service/construtora.service';
import { ConstrutoraModel } from '../construtora/model/construtora.model';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss']
})
export class ServicoComponent implements OnInit {

  @ViewChild('modalVisualizarDetalhes', { static: true })
  modalVisualizarDetalhes!: ElementRef;

  @ViewChild('arquivoXLSX', { static: false }) arquivoXLSX!: ElementRef;

  servicoModel = new ServicoModel();
  cadastroServico = new ServicoModel();
  construtora: ConstrutoraModel | null = null;
  centroCusto: CentroCustoModel | null = null;
  listaServicos: ServicoModel[] = [];
  listaConstrutoras: ConstrutoraModel[] = [];
  listaCentrosDeCusto: CentroCustoModel[] = [];
  listaLocais: LocalServicoModel[] = [];
  listaSubGroup1: string[] = [];
  listaSubGroup2: string[] = [];
  listaSubGroup3: string[] = [];
  listaTiposServico: TipoServicoModel[] = [];
  displayedColumns: string[] = ["acoes", "costCenter", "locationGroup", 'subGroup1', 'subGroup2', 'taskType', 'dimension', 'unitMeasurement'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;
  filtroSelecionado: string | null = null;
  listaServicosFiltrada: ServicoModel[] = [];
  listaCentrosDeCustoFiltrada: CentroCustoModel[] = [];
  servicoTab: number = 0;
  arquivoSelecionado: File | undefined;

  constructor(
    private servicoService: ServicoService,
    private construtoraService: ConstrutoraService,
    private centroCustoService: CentroCustoService,
    private localService: LocalServicoService,
    private tiposServicoService: TiposServicoService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buscarServicos();
    this.buscarConstrutoras();
    this.buscarTiposServico();
    this.cadastroServico.taskLocation = {
      locationGroup: '',
      subGroup1: '',
      subGroup2: '',
      subGroup3: '',
      costCenter: {} as CentroCustoModel
    };
  }

  async mudarAba(posicao: number) {
    this.servicoTab = posicao;
    if (posicao === 0) {
      this.cadastroServico = new ServicoModel();
    } else if (posicao === 1) {
      await this.buscarServicos();
    } else if (posicao === 2) {
      await this.buscarServicos();;
    }
    this.limparCampos()
  }

  compareFnConstrutora(c1: ConstrutoraModel, c2: ConstrutoraModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareFnCentroCusto(c1: CentroCustoModel, c2: CentroCustoModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  setCostCenter(value: CentroCustoModel | null) {
    if (value !== null && value.id !== undefined) {
      this.cadastroServico.costCenter = value;
      this.buscarLocaisPorCentroDeCusto(value.id);
    }
  }

  async buscarServicos() {
    try {
      const servicos: any = await firstValueFrom(this.servicoService.listarServicos());
      this.listaServicos = servicos;
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

  async buscarCentrosDeCustoPorConstrutora(id: number) {
    try {
      const centros: any = await firstValueFrom(this.centroCustoService.listarCentrosDeCustoPorConstrutora(id));
      this.listaCentrosDeCusto = centros;
    } catch (error) {
      console.error(error);
    }
  }

  async buscarLocaisPorCentroDeCusto(id: number) {
    try {
      const locais: any = await firstValueFrom(this.localService.listarLocaisPorCentroDeCusto(id));
      this.listaLocais = locais;
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

  filtrarNivel2(nivel1: string | undefined) {
    if (nivel1 !== undefined) {
      // Filtrar dados do nível 2 baseado na seleção do nível 1
      this.listaSubGroup1 = this.listaLocais
        .filter(local => local.locationGroup === nivel1)
        .map(local => local.subGroup1)
        .filter((subGroup): subGroup is string => subGroup !== undefined)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
    }
  }

  filtrarNivel3(nivel1: string | undefined, nivel2: string | undefined) {
    if (nivel1 !== undefined && nivel2 !== undefined) {
      // Filtrar dados do nível 3 baseado na seleção do nível 1 e 2
      this.listaSubGroup2 = this.listaLocais
        .filter(local => local.locationGroup === nivel1 && local.subGroup1 === nivel2 && 
          local.subGroup2 !== undefined && local.subGroup2 !== '' && local.subGroup2 !== null)
        .map(local => local.subGroup2)
        .filter((subGroup): subGroup is string => subGroup !== undefined)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
    }
  }

  filtrarNivel4(nivel1: string | undefined, nivel2: string | undefined, nivel3: string | undefined) {
    if (nivel1 !== undefined && nivel2 !== undefined && nivel3 !== undefined) {
      // Filtrar dados do nível 4 baseado na seleção do nível 1, 2 e 3
      this.listaSubGroup3 = this.listaLocais
        .filter(local => local.locationGroup === nivel1 && local.subGroup1 === nivel2 &&
          local.subGroup2 === nivel3).map(local => local.subGroup3)
        .filter((subGroup): subGroup is string => subGroup !== undefined)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
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

  parseValue(inputValue: string): number {
    let numberValue = inputValue.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(numberValue);
  }
  
  calcularValorTotal() {
    this.cadastroServico.amount = this.cadastroServico.dimension * this.cadastroServico.unitaryValue;
  }

  async cadastrarServico() {
    if (!this.validarCampos(this.cadastroServico)){
      return;
    };
    this.cadastroServico.taskLocation.costCenter = this.cadastroServico.costCenter;
    this.cadastroServico.unitMeasurement = this.cadastroServico.taskType.unitMeasurement;
    this.servicoService.cadastrarServico(this.cadastroServico).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        this.limparCampos()
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
    if (!this.validarCampos(this.cadastroServico)){
      return;
    };
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
      return false;
    }

    if (servico.taskType === null || servico.taskType === undefined) {
      Swal.fire({
        text: "É obrigatório informar o tipo de serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.taskLocation === null || servico.taskLocation === undefined) {
      Swal.fire({
        text: "É obrigatório informar o local de execução do serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.dimension === null || servico.dimension == 0
      || servico.dimension === undefined) {
      Swal.fire({
        text: "É obrigatório informar a dimensão do serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.expectedStartDate === null || servico.taskLocation === undefined) {
      Swal.fire({
        text: "É obrigatório informar a data de início prevista para o serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.expectedEndDate === null || servico.expectedEndDate === undefined) {
      Swal.fire({
        text: "É obrigatório informar a data de final prevista para o serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.expectedStartDate > servico.expectedEndDate) {
      Swal.fire({
        text: "A data de início previsto não pode ser posterior a data de final prevista!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (servico.unitaryValue === null || servico.unitaryValue === undefined
      || servico.unitaryValue === 0) {
      Swal.fire({
        text: "É obrigatório informar o valor unitário do serviço!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
    return true;
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
    this.servicoModel.id = servico.id;
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

  calcularValorTotalModal() {
    this.servicoModel.amount = this.servicoModel.dimension * this.servicoModel.unitaryValue;
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

  limparCampos() {
    this.cadastroServico = new ServicoModel();
    this.centroCusto = null;
    this.construtora = null;
    this.listaTiposServico = [];
    this.buscarServicos();
    this.buscarConstrutoras();
    this.buscarCentrosDeCustoPorConstrutora(0);
    this.buscarTiposServico();
    this.cadastroServico.taskLocation = {
      locationGroup: '',
      subGroup1: '',
      subGroup2: '',
      subGroup3: '',
      costCenter: {} as CentroCustoModel
    };
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.arquivoSelecionado = target.files[0];
    }
  }

  async cadastrarEmLote() {
    if (this.arquivoSelecionado) {
      this.spinner.show();
      try {
        const taskCount = await this.servicoService.enviarArquivo(this.arquivoSelecionado);
        this.spinner.hide();
        Swal.fire({
          html: `Arquivo enviado com sucesso!<br> <b>${taskCount} novos serviços foram incluídos!</b>`,
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
      } catch (error) {
        const message = (error as Error).message;
        Swal.fire({
            text: message,
            icon: "error",
            showConfirmButton: false,
            timer: 3000
          });
      }
    } else {
      Swal.fire('Erro', 'Nenhum arquivo selecionado', 'error');
    }
  }

  triggerFileInput() {
    this.arquivoXLSX.nativeElement.click();
  }
  
}