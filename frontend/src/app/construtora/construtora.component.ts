import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConstrutoraModel } from './model/construtora.model';
import { ConstrutoraService } from './service/construtora.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-construtora',
  templateUrl: './construtora.component.html',
  styleUrls: ['./construtora.component.scss']
})
export class ConstrutoraComponent {

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
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  async buscarConstrutoras() {
    try {
      this.spinner.show();
      const construtoras: any = await firstValueFrom(this.construtoraService.listarConstrutoras());
      this.listaConstrutoras = construtoras;
      this.spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

  mudarAba() {
    this.isCadastroConstrutora = !this.isCadastroConstrutora;
    if (!this.isCadastroConstrutora) {
      this.buscarConstrutoras();
    }
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
    if (!this.validarCampos(this.cadastroConstrutora)) {
      return;
    }
    this.spinner.show();
    this.construtoraService.cadastrarConstrutora(this.cadastroConstrutora).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('CONSTRUTORS.SUCCESS_MESSAGE'),
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.cadastroConstrutora = new ConstrutoraModel();
      }),
      catchError(error => {
        this.spinner.hide();
        let msgErro = error.error;

        if (error.error === "A Builder with the same CNPJ already exists") {
          msgErro = this.translate.instant('CONSTRUTORS.ERROR_CNPJ_EXISTS');
        }
        
        if (error.error === "A Builder with the same name already exists") {
          msgErro = this.translate.instant('CONSTRUTORS.ERROR_NAME_EXISTS');
        }

        Swal.fire({
          text: msgErro,
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
        return of();
      })
    ).subscribe();
  }

  atualizarDadosConstrutora(construtora: ConstrutoraModel) {
    if (!this.validarCampos(construtora)) {
      return;
    };
    this.spinner.show();
    this.construtoraService.atualizarDadosConstrutora(construtora).pipe(
      tap(retorno => {
        this.spinner.hide();
        Swal.fire({
          text: this.translate.instant('CONSTRUTORS.UPDATE_SUCCESS_MESSAGE'),
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

  validarCampos(construtora: ConstrutoraModel) {
    if (!this.validaCNPJ(construtora.cnpj)) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.INVALID_CNPJ'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (construtora.builderName === null || construtora.builderName.trim() === ""
      || construtora.builderName === undefined) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.REQUIRED_NAME'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (construtora.builderAddress.street === null || construtora.builderAddress.street.trim() === ""
      || construtora.builderAddress.street === undefined) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.REQUIRED_STREET'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (construtora.builderAddress.postalCode === null || construtora.builderAddress.postalCode.trim() === ""
      || construtora.builderAddress.postalCode === undefined) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.REQUIRED_POSTAL_CODE'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (construtora.builderAddress.city === null || construtora.builderAddress.city.trim() === ""
      || construtora.builderAddress.city === undefined) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.REQUIRED_CITY'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    if (construtora.builderAddress.state === null || construtora.builderAddress.state.trim() === ""
      || construtora.builderAddress.state === undefined) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.REQUIRED_STATE'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.phone === null || construtora.phone.trim() === ""
      || construtora.phone === undefined) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.REQUIRED_PHONE'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.phone.length < 10) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.MIN_PHONE_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.builderName.length < 6) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.MIN_NAME_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.builderName.length > 254) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.MAX_NAME_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.builderAddress.postalCode.length != 9) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.POSTAL_CODE_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.builderAddress.street.length < 6) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.MIN_STREET_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.builderAddress.street.length > 254) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.MAX_STREET_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.builderAddress.city.length < 6) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.MIN_CITY_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    if (construtora.builderAddress.city.length > 254) {
      Swal.fire({
        text: this.translate.instant('CONSTRUTORS.MAX_CITY_LENGTH'),
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }

    return true;
  }

  visualizarDetalhes(construtora: ConstrutoraModel) {
    this.construtoraModel = JSON.parse(JSON.stringify(construtora)); //Clonando objeto e não a sua referência
    this.renderModalVisualizar = true;
    Swal.fire({
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('CONSTRUTORS.EDIT_BUTTON'),
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
      title: this.translate.instant('CONSTRUTORS.EDIT_TITLE'),
      html: this.modalVisualizarDetalhes.nativeElement,
      showCloseButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: this.translate.instant('CONSTRUTORS.SAVE_BUTTON'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('CONSTRUTORS.CANCEL_BUTTON'),
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.atualizarDadosConstrutora(this.construtoraModel);
      } else if (result.isDismissed) {
        this.construtoraModel = new ConstrutoraModel();
      }
    });
  }

  excluirConstrutora(id: number, builderName: string) {
    Swal.fire({
      title: this.translate.instant('CONSTRUTORS.DELETE_TITLE'),
      html: this.translate.instant('CONSTRUTORS.DELETE_CONFIRMATION', { builderName: builderName }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('CONSTRUTORS.CONFIRM_DELETE_BUTTON'),
      confirmButtonColor: 'red',
      cancelButtonText: this.translate.instant('CONSTRUTORS.CANCEL_BUTTON'),
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.construtoraService.excluirConstrutora(id).pipe(
          tap(retorno => {
            this.spinner.hide();
            Swal.fire({
              text: this.translate.instant('CONSTRUTORS.DELETE_SUCCESS_MESSAGE'),
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            this.buscarConstrutoras();
          }),
          catchError(error => {
            this.spinner.hide();
            let msgErro = error.error;
            if (error.error === "This Builder has a Cost Center related to it, please delete the Cost Center first!") {
              msgErro = this.translate.instant('CONSTRUTORS.ERROR_COST_CENTER_RELATED');
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
    this.construtoraModel = new ConstrutoraModel();
    this.cadastroConstrutora = new ConstrutoraModel();
    this.buscarConstrutoras();
  }
}