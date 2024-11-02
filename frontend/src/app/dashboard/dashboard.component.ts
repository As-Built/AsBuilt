import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { ValorProducaoService } from '../shared/service/valor-producao.service';
import { ValorProducaoModel } from '../shared/model/valor-producao.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  implements OnInit{

  userName: string = "";
  userId: number = 0;
  producaoDoMes: ValorProducaoModel[] = [];
  
  constructor(private router: Router,
    private http: HttpClient,
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

  buscarProducaoDoMes() {
    let mesAtual = new Date().getMonth() + 1; // Os meses são indexados de 0 a 11 com o getMonth
    this.valorProducaoService.buscarValorProducaoPorMes(mesAtual, this.userId).subscribe((producao) => {
      this.producaoDoMes = producao;
    });
  }

}