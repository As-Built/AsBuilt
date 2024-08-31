import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthguardService } from '../authguard/authguard.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  authorities: string[] = [];
  mostrarSidebar = true;
  isSidebarOpen = true;
  private authSubscription: Subscription = new Subscription();

  constructor(private authGuardService: AuthguardService) { }

  @ViewChild(SidebarComponent, { static: false }) 
  sidebarComponent: SidebarComponent = new SidebarComponent(this.authGuardService);  

  ngOnInit(): void {
    const authority = localStorage.getItem('authority');
    this.authorities = [authority ? authority : ''];
  
    this.authSubscription = this.authGuardService.authorities$.subscribe(
      authorities => this.authorities = authorities
    );

    this.sidebarComponent.sidebarToggle.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

  ngOnDestroy() {
    this.authorities.splice(0, this.authorities.length);
  }
}