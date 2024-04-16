import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor(private router: Router) { }

  public get mostrarSidebar(): boolean {
    const url = this.router.url;
    return !['/home', '/login'].includes(url);
  }
}