import { Component } from '@angular/core';
import { CadastroCentroCustoModel } from './model/cadastro-centro-custo.model';
import { CadastroCentroCustoService } from './service/cadastro-centro-custo.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cadastro-centro-custo',
  templateUrl: './cadastro-centro-custo.component.html',
  styleUrls: ['./cadastro-centro-custo.component.scss']
})
export class CadastroCentroCustoComponent {

  cadastroCentroCusto = new CadastroCentroCustoModel();

  constructor(
    private cadastroCentroCustoService: CadastroCentroCustoService) { }

  cadastrarCentroDeCusto(){
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
}
