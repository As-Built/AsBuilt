import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  
  @ViewChild(SidebarComponent, { static: false }) 
  sidebarComponent: SidebarComponent = new SidebarComponent();  

}
