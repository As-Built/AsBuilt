import { Component } from '@angular/core';
import { ConstrutoraModel } from './model/construtora.model';
import { ConstrutoraService } from './service/construtora.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-construtora',
  templateUrl: './construtora.component.html',
  styleUrls: ['./construtora.component.scss']
})
export class ConstrutoraComponent {

  cadastroConstrutora = new ConstrutoraModel();

  constructor(
    private construtoraService: ConstrutoraService,
    private http: HttpClient) { }

  estadosBrasileiros = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  getAddress(cep: string) {
    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((endereco: any) => {
      this.cadastroConstrutora.builderAddress.postalCode = endereco.cep;
      this.cadastroConstrutora.builderAddress.street = endereco.logradouro;
      this.cadastroConstrutora.builderAddress.city = endereco.localidade;
      this.cadastroConstrutora.builderAddress.state = endereco.uf;
    })
  }
  
  validaCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj === '') return false;
    if (cnpj.length !== 14) return false;
    if (cnpj === "00000000000000" || 
        cnpj === "11111111111111" || 
        cnpj === "22222222222222" || 
        cnpj === "33333333333333" || 
        cnpj === "44444444444444" || 
        cnpj === "55555555555555" || 
        cnpj === "66666666666666" || 
        cnpj === "77777777777777" || 
        cnpj === "88888888888888" || 
        cnpj === "99999999999999"
    ) {
      return false;
    }
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    let i: number; // Declare the variable 'i' here
    for (i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    return true;
  }

  cadastrarConstrutora(){
    this.validarCampos();
    this.construtoraService.cadastrarConstrutora(this.cadastroConstrutora).subscribe(
      retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
      },
      (error) => {
          Swal.fire({
            text: error.error,
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
    });
  }

  validarCampos() {
    if (this.validaCNPJ(this.cadastroConstrutora.cnpj) === false) {
      Swal.fire({
        text: "CNPJ inválido!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroConstrutora.builderName === null || this.cadastroConstrutora.builderName.trim() === ""
    || this.cadastroConstrutora.builderName === undefined) {
      Swal.fire({
        text: "O campo 'Nome da construtora' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroConstrutora.builderAddress.street === null || this.cadastroConstrutora.builderAddress.street.trim() === ""
    || this.cadastroConstrutora.builderAddress.street === undefined) {
      Swal.fire({
        text: "O campo 'Logradouro' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroConstrutora.builderAddress.postalCode === null || this.cadastroConstrutora.builderAddress.postalCode.trim() === ""
    || this.cadastroConstrutora.builderAddress.postalCode === undefined) {
      Swal.fire({
        text: "O campo 'CEP' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroConstrutora.builderAddress.city === null || this.cadastroConstrutora.builderAddress.city.trim() === ""
    || this.cadastroConstrutora.builderAddress.city === undefined) {
      Swal.fire({
        text: "O campo 'Cidade' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroConstrutora.builderAddress.state === null || this.cadastroConstrutora.builderAddress.state.trim() === ""
    || this.cadastroConstrutora.builderAddress.state === undefined) {
      Swal.fire({
        text: "O campo 'UF' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
  }

}