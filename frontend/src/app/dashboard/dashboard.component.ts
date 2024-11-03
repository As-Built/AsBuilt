import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { ValorProducaoService } from '../shared/service/valor-producao.service';
import { ValorProducaoModel } from '../shared/model/valor-producao.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {

  userName: string = "";
  userId: number = 0;
  producaoDoMes: ValorProducaoModel[] = [];
  servicosNoMes: number = 0;
  aprovacoesNoMes: number = 0;
  reprovacoesNoMes: number = 0;
  mediaAprovacaoNoMes: number = 0;
  remuneracaoAtual: number = 0;
  valorProduzidoNoMes: number = 0;
  producaoEfetivaNoMes: number = 0;


  constructor(private router: Router,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private valorProducaoService: ValorProducaoService
  ) { }

  ngOnInit(): void {
    this.getUserFromToken()
    this.buscarProducaoDoMes()
  }

  getUserFromToken() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token!) as any;
    this.userName = decodedToken.user.name;
    this.userId = decodedToken.user.id;
  }

  async buscarProducaoDoMes() {
    this.spinner.show();
    try {
      let mesAtual = new Date().getMonth() + 1; // Os meses são indexados de 0 a 11 com o getMonth
      const producaoNoMes = await firstValueFrom(this.valorProducaoService.buscarValorProducaoPorMes(mesAtual, this.userId));
      this.producaoDoMes = producaoNoMes;
    } catch (error) {
      console.error(error);
    }
    this.contabilizarProducao();
    this.spinner.hide();
  }

  contabilizarProducao() {
    this.servicosNoMes = this.producaoDoMes.length;
    this.aprovacoesNoMes = this.producaoDoMes.filter((producao) => producao.assessment.assessmentResult == true).length;
    this.reprovacoesNoMes = this.producaoDoMes.filter((producao) => producao.assessment.assessmentResult == false).length;
    this.mediaAprovacaoNoMes = (this.aprovacoesNoMes / this.servicosNoMes) * 100;
    let ultimoSalario: any;
    if (this.producaoDoMes[0].user.salaries !== null || this.producaoDoMes[0].user.salaries !== undefined) {
      ultimoSalario = this.producaoDoMes[0].user.salaries![0];
    }
    this.producaoDoMes.forEach((producao) => {
      this.valorProduzidoNoMes += producao.value;
      if (producao.user.salaries) {
        producao.user.salaries.forEach((salario) => {
          if (salario.updateDate > ultimoSalario.updateDate) {
            this.remuneracaoAtual = salario.value;
          }
          else {
            this.remuneracaoAtual = ultimoSalario.value;
          }
        });
      }
    });
    this.producaoEfetivaNoMes = this.valorProduzidoNoMes - this.remuneracaoAtual;
  }

}