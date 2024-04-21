import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild(SidebarComponent, { static: false }) 
  sidebarComponent: SidebarComponent = new SidebarComponent();  

  constructor(private router: Router) { }
  ngOnInit(): void {
    if (this.sidebarComponent === undefined) {
      this.sidebarComponent = new SidebarComponent();
      this.sidebarComponent.isSidebarOpen = true;
    }
  }

  public get mostrarSidebar(): boolean {
    const url = this.router.url;
    return !['/home','/login'].includes(url);
  }
}
