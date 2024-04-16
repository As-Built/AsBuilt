import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthguardService } from '../authguard/authguard.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  authorities: string[] | null = null;

  constructor(private router: Router,
    private authguardService: AuthguardService) {
      this.authguardService.authorities$.subscribe(authority => {
        this.authorities = authority;
     })
    }

  ngOnInit(): void {
  }
  servicos() {
    this.router.navigate(['/api/servicos/']);
  }

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  showFiller = false;

  cadastrarServico() {
    this.router.navigate(['/api/cadastroservico']);
  }

  // listarServicos() {
  //   this.router.navigate(['/api/listar-servicos']);
  // }

  // cadastrarCentros() {
  //   this.router.navigate(['/api/centro-custo']);
  // }

  // listarCentros() {
  //   this.router.navigate(['/api/listar-centros']);
  // }

  // avaliarServicos() {
  //   this.router.navigate(['/api/avaliar']);
  // }

  // reavaliarServicos() {
  //   this.router.navigate(['/api/reavaliar']);
  // }

  // financeiro() {
  //   this.router.navigate(['/api/financeiro']);
  // }

  // dashboard() {
  //   this.router.navigate(['/api/dashboard-usuario']);
  // }

  // producao() {
  //   this.router.navigate(['/api/producao']);
  // }

  // avaliacoes() {
  //   this.router.navigate(['/api/avaliacoes']);
  // }
}