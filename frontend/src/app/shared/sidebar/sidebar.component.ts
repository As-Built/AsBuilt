import { Component, Input, OnInit, HostListener } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input ()
  isSidebarOpen = true;

  userRole: string;

  constructor() {
    this.userRole = this.getUserRole();
  }

  ngOnInit() {
    if (window.innerWidth < 576) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return "";
    }

    const decodedToken = jwtDecode(token) as any;
    const userRole = decodedToken.user.roles[0];
    return userRole;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSidebarOpen = (event.target as Window).innerWidth >= 576;
  }
}