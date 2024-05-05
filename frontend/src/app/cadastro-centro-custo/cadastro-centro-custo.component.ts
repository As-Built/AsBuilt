import { Component } from '@angular/core';
import { CadastroCentroCustoModel } from './model/cadastro-centro-custo.model';
import { CadastroCentroCustoService } from './service/cadastro-centro-custo.service';
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
import { EnderecoModel } from '../shared/model/endereco.model';

@Component({
  selector: 'app-cadastro-centro-custo',
  templateUrl: './cadastro-centro-custo.component.html',
  styleUrls: ['./cadastro-centro-custo.component.scss']
})
export class CadastroCentroCustoComponent {

  cadastroCentroCusto = new CadastroCentroCustoModel();

  constructor(
    private cadastroCentroCustoService: CadastroCentroCustoService,
    private http: HttpClient) { }

  getAddress(cep: string) {
    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((endereco: any) => {
      this.cadastroCentroCusto.costCenterAddress.postalCode = endereco.cep;
      this.cadastroCentroCusto.costCenterAddress.street = endereco.logradouro;
      this.cadastroCentroCusto.costCenterAddress.city = endereco.localidade;
      this.cadastroCentroCusto.costCenterAddress.state = endereco.uf;
    })
  }
  

  cadastrarCentroDeCusto(){
    this.validarCampos();
    this.cadastroCentroCustoService.cadastrarCentroDeCusto(this.cadastroCentroCusto).subscribe(
      retorno => {
        Swal.fire({
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
      },
      (error) => {
        if (error.error == "Cost Center already exists") {
          Swal.fire({
            text: "Já existe um centro de custo com esse nome!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
        }
        if (error.error == "A Cost Center with the same address already exists!") {
          Swal.fire({
            text: "Já existe um centro de custo cadastrado neste endereço!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
        }
    });
  }

  validarCampos() {
    if (this.cadastroCentroCusto.costCenterName === null || this.cadastroCentroCusto.costCenterName.trim() === ""
    || this.cadastroCentroCusto.costCenterName === undefined) {
      Swal.fire({
        text: "O campo 'Nome do Centro de Custo' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroCentroCusto.costCenterAddress.street === null || this.cadastroCentroCusto.costCenterAddress.street.trim() === ""
    || this.cadastroCentroCusto.costCenterAddress.street === undefined) {
      Swal.fire({
        text: "O campo 'Logradouro' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroCentroCusto.costCenterAddress.postalCode === null || this.cadastroCentroCusto.costCenterAddress.postalCode.trim() === ""
    || this.cadastroCentroCusto.costCenterAddress.postalCode === undefined) {
      Swal.fire({
        text: "O campo 'CEP' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroCentroCusto.costCenterAddress.city === null || this.cadastroCentroCusto.costCenterAddress.city.trim() === ""
    || this.cadastroCentroCusto.costCenterAddress.city === undefined) {
      Swal.fire({
        text: "O campo 'Cidade' é obrigatório!",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    if (this.cadastroCentroCusto.costCenterAddress.state === null || this.cadastroCentroCusto.costCenterAddress.state.trim() === ""
    || this.cadastroCentroCusto.costCenterAddress.state === undefined) {
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