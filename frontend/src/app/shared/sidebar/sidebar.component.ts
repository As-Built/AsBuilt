import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  public sidebarShow = true;

}
