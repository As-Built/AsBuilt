import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(SidebarComponent, { static: true })
  public sidebarComponent: SidebarComponent = new SidebarComponent;


  title = 'AsBuiltFrontEnd';
  

}
