import { Component } from '@angular/core';
import { CadastroServicoModel } from './model/cadastro-servico.model';
import { CadastroServicoService } from './service/cadastro-servico.service';


@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.component.html',
  styleUrls: ['./cadastro-servico.component.scss']
})
export class CadastroServicoComponent {
  cadastroServico = new CadastroServicoModel();
  constructor(private cadastroServicoService: CadastroServicoService) { }

  calculateValorTotal() {
    this.cadastroServico.valorTotal = this.cadastroServico.valorUnitario * this.cadastroServico.dimensao;
  }

  submitForm() {
    // Realizar validações
    if (!this.cadastroServico.tipoServico) {
      alert("Por favor, informe o tipo de serviço.");
      return;
    }
    if (this.cadastroServico.valorUnitario <= 0) {
      alert("O valor unitário deve ser maior que zero.");
      return;
    }
    if (this.cadastroServico.dimensao <= 0) {
      alert("A dimensão deve ser maior que zero.");
      return;
    }
    if (!this.cadastroServico.unidadeMedida) {
      alert("Por favor, informe a unidade de medida.");
      return;
    }
    if (!this.cadastroServico.localExecucao) {
      alert("Por favor, informe o local de execução.");
      return;
    }
    if (!this.cadastroServico.dataInicio) {
      alert("Por favor, informe a data de início.");
      return;
    }
    if (!this.cadastroServico.previsaoTermino) {
      alert("Por favor, informe a previsão de término.");
      return;
    }
    // Submeter o formulário se todas as validações passarem
    this.cadastroServicoService.CadastrarServico(this.cadastroServico).subscribe(
      retorno => {
        alert("Cadastro realizado com sucesso!");
      },
      (error) => {
        alert(error.error);
      }
    );
  }
}
