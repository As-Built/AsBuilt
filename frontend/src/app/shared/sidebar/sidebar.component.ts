import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthguardService } from '../authguard/authguard.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  @Input()
  isSidebarOpen = true;

  @Input() authorities: string[] = [];

  @Output() sidebarToggle = new EventEmitter<boolean>();
  
  private authSubscription: Subscription = new Subscription();

  constructor(private authGuardService: AuthguardService) { }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.sidebarToggle.emit(this.isSidebarOpen);
  }
  
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  userHasRole(role: string): boolean {
    return this.authorities.includes(role);
  }
}