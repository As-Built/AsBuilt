import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isSidebarOpen = new BehaviorSubject(false);
  isSidebarOpen$ = this._isSidebarOpen.asObservable();

  openSidebar() {
    this._isSidebarOpen.next(true);
  }

  closeSidebar() {
    this._isSidebarOpen.next(false);
  }
}