// sidebar-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  private isExpanded = new BehaviorSubject<boolean>(false);
  isExpanded$ = this.isExpanded.asObservable();

  toggle() {
    this.isExpanded.next(!this.isExpanded.value);
  }
}