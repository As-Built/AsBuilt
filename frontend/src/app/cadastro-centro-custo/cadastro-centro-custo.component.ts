import { Component } from '@angular/core';
import { CadastroCentroCustoModel } from './model/cadastro-centro-custo.model';
import { CadastroCentroCustoService } from './service/cadastro-centro-custo.service';

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
      alert("Cadastro realizado com sucesso!");
    },
      (error) => {
          alert(error.error);
    });
  }
}
