import { Component, Input, OnInit } from '@angular/core';
import { jwtDecode } from "jwt-decode";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{


  ngOnInit(): void {
    this.userName = this.getUserName();
  }

  public userName: string = '';

  @Input ()
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getUserName(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return "";
    }
  
    const decodedToken = jwtDecode(token) as any;
    const fullName = decodedToken.user.name;
    const firstName = fullName.split(' ')[0];
    return firstName;
  }
}