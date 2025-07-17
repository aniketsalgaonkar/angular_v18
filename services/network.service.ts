import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private messageService: MessageService) {
    this.initializeNetworkEvents();
    const initialStatus = navigator.onLine ? ConnectionStatus.Online : ConnectionStatus.Offline;
    this.status.next(initialStatus);
  }

  public initializeNetworkEvents() {
    window.addEventListener('offline', () => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    window.addEventListener('online', () => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  private updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    const connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    this.messageService.add({
      severity: status === ConnectionStatus.Online ? 'success' : 'error',
      summary: 'Network Status',
      detail: `You are now ${connection}`,
      life: 3000
    });
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}