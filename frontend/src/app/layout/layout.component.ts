import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements AfterViewInit {
  @ViewChild(SidebarComponent, { static: false }) 
  sidebarComponent: SidebarComponent = new SidebarComponent();  

  constructor(private router: Router) { }
  ngAfterViewInit(): void {
    if (this.sidebarComponent === undefined) {
      this.sidebarComponent = new SidebarComponent();
    }
  }

  public get mostrarSidebar(): boolean {
    const url = this.router.url;
    return !['/home', '/login'].includes(url);
  }
}