import { Component, Input } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input ()
  isSidebarOpen = true;

  userRole: string;

  constructor() {
    this.userRole = this.getUserRole();
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
}