import { Component, OnInit, ViewChild } from '@angular/core';
import { CadastroServicoModel } from './model/cadastro-servico.model';
import { CadastroServicoService } from './service/cadastro-servico.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';


@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.component.html',
  styleUrls: ['./cadastro-servico.component.scss']
})
export class CadastroServicoComponent implements OnInit {
  cadastroServico = new CadastroServicoModel();

  @ViewChild(SidebarComponent, { static: false }) 
  sidebarComponent: SidebarComponent = new SidebarComponent();  

  constructor(private cadastroServicoService: CadastroServicoService) { }

  ngOnInit(): void {
    if (this.sidebarComponent === undefined) {
      this.sidebarComponent = new SidebarComponent();
      this.sidebarComponent.isSidebarOpen = true;
    }
  }

  calculateValorTotal() {
    this.cadastroServico.amount = this.cadastroServico.unitaryValue * this.cadastroServico.dimension;
  }

  submitForm() {
    // Realizar validações
    if (!this.cadastroServico.taskType) {
      alert("Por favor, informe o tipo de serviço.");
      return;
    }
    if (this.cadastroServico.unitaryValue <= 0) {
      alert("O valor unitário deve ser maior que zero.");
      return;
    }
    if (this.cadastroServico.dimension <= 0) {
      alert("A dimensão deve ser maior que zero.");
      return;
    }
    if (!this.cadastroServico.unitaryValue) {
      alert("Por favor, informe a unidade de medida.");
      return;
    }
    if (!this.cadastroServico.placeOfExecution) {
      alert("Por favor, informe o local de execução.");
      return;
    }
    if (!this.cadastroServico.startDate) {
      alert("Por favor, informe a data de início.");
      return;
    }
    if (!this.cadastroServico.expectedEndDate) {
      alert("Por favor, informe a previsão de término.");
      return;
    }
    // Submeter o formulário se todas as validações passarem
    this.cadastroServicoService.cadastrarServico(this.cadastroServico).subscribe(
      retorno => {
        alert("Cadastro realizado com sucesso!");
      },
      (error) => {
        alert(error.error);
      }
    );
  }
}
