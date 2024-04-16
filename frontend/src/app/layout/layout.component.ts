import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  // @ViewChild(SidebarComponent, { static: true }) 
  // sidebarComponent: SidebarComponent = new SidebarComponent();  

  constructor(private router: Router) { }

  public get mostrarSidebar(): boolean {
    const url = this.router.url;
    return !['/home', '/login'].includes(url);
  }
}