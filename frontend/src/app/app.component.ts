import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements AfterViewInit {
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
    return !['/home'].includes(url);
  }
}