import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  private sidebarShow = new BehaviorSubject(true);
  sidebarShow$ = this.sidebarShow.asObservable();

  toggleSidebar() {
    this.sidebarShow.next(!this.sidebarShow.value);
  }

}
