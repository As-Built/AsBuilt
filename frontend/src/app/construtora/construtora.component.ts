import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConstrutoraModel } from './model/construtora.model';
import { ConstrutoraService } from './service/construtora.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

@Component({
  selector: 'app-construtora',
  templateUrl: './construtora.component.html',
  styleUrls: ['./construtora.component.scss']
})
export class ConstrutoraComponent implements OnInit {

  @ViewChild('modalVisualizarDetalhes', { static: true })
  modalVisualizarDetalhes!: ElementRef;

  construtoraModel = new ConstrutoraModel();
  cadastroConstrutora = new ConstrutoraModel();
  estadosBrasileiros = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  isCadastroConstrutora = true;
  listaConstrutoras: ConstrutoraModel[] = [];
  displayedColumns: string[] = ["acoes", "builderName", 'cnpj', 'phone'];
  renderModalVisualizar = false;
  indDesabilitaCampos = true;

  constructor(
    private construtoraService: ConstrutoraService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.buscarConstrutoras();
  }

  async buscarConstrutoras() {
    try {
      const construtoras: any = await firstValueFrom(this.construtoraService.listarConstrutoras());
      this.listaConstrutoras = construtoras;
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.buscarConstrutoras();
    this.isCadastroConstrutora = !this.isCadastroConstrutora;
  }

  getAddress(cep: string, modal: boolean) {
    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((endereco: any) => {
      if (modal) {
        this.construtoraModel.builderAddress.postalCode = endereco.cep;
        this.construtoraModel.builderAddress.street = endereco.logradouro;
        this.construtoraModel.builderAddress.city = endereco.localidade;
        this.construtoraModel.builderAddress.state = endereco.uf;
        this.construtoraModel.builderAddress.number = 0;
      } else {
        this.cadastroConstrutora.builderAddress.postalCode = endereco.cep;
        this.cadastroConstrutora.builderAddress.street = endereco.logradouro;
        this.cadastroConstrutora.builderAddress.city = endereco.localidade;
        this.cadastroConstrutora.builderAddress.state = endereco.uf;
        this.cadastroConstrutora.builderAddress.number = 0;
      }
    })
  }

  validaCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    let i: number = 0;
    for (i = tamanho; i >= 1; i--) {
      soma += parseFloat(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseFloat(digitos.charAt(0)))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += parseFloat(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseFloat(digitos.charAt(1)))
          return false;
           
    return true;
    
}

  cadastrarConstrutora() {
    this.validarCampos(this.cadastroConstrutora);
    this.construtoraService.cadastrarConstrutora(this.cadastroConstrutora).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.cadastroConstrutora = new ConstrutoraModel();
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

  atualizarDadosConstrutora(construtora: ConstrutoraModel) {
    this.validarCampos(construtora);
    this.construtoraService.atualizarDadosConstrutora(construtora).pipe(
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

  validarCampos(construtora: ConstrutoraModel) {
    if (this.validaCNPJ(construtora.cnpj) === false) {
      Swal.fire({
        text: "CNPJ inválido!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (construtora.builderName === null || construtora.builderName.trim() === ""
      || construtora.builderName === undefined) {
      Swal.fire({
        text: "O campo 'Nome da construtora' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (construtora.builderAddress.street === null || construtora.builderAddress.street.trim() === ""
      || construtora.builderAddress.street === undefined) {
      Swal.fire({
        text: "O campo 'Logradouro' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (construtora.builderAddress.postalCode === null || construtora.builderAddress.postalCode.trim() === ""
      || construtora.builderAddress.postalCode === undefined) {
      Swal.fire({
        text: "O campo 'CEP' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (construtora.builderAddress.city === null || construtora.builderAddress.city.trim() === ""
      || construtora.builderAddress.city === undefined) {
      Swal.fire({
        text: "O campo 'Cidade' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (construtora.builderAddress.state === null || construtora.builderAddress.state.trim() === ""
      || construtora.builderAddress.state === undefined) {
      Swal.fire({
        text: "O campo 'UF' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
  }

  visualizarDetalhes(construtora: ConstrutoraModel) {
    this.construtoraModel = JSON.parse(JSON.stringify(construtora)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: 'Detalhes da Construtora',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Editar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalEditarConstrutora(construtora);
      }
    });
  }

  modalEditarConstrutora(construtora: ConstrutoraModel) {
    this.indDesabilitaCampos = false;
    this.construtoraModel = JSON.parse(JSON.stringify(construtora)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      title: 'Editar Construtora',
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Salvar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.atualizarDadosConstrutora(this.construtoraModel);
      } else if (result.isDismissed) {
        this.construtoraModel = new ConstrutoraModel();
      }
    });
  }

  excluirConstrutora(id: number) {
    this.construtoraService.excluirConstrutora(id).pipe(
      tap(retorno => {
        Swal.fire({
          text: "Construtora excluída com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.buscarConstrutoras();
      }),
      catchError(error => {
        let msgErro = error.error;
        if (error.error === "This Builder has a Cost Center related to it, please delete the Cost Center first!") {
          msgErro = "Essa construtora possui um centro de custo relacionado a ela, por favor, exclua o centro de custo primeiro!";
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

}