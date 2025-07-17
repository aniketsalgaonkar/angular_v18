import { Injectable } from '@angular/core';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

// import { MainPageService } from '../Services/MainPage.service';
import { MenuService } from './menu.service';
import { environment } from '../../environments/environment';

const STORAGE_REQ_KEY = 'storedreq';

interface FileObject {
    name: string,
    FileData: Blob
}

interface StoredRequest {
    url: string,
    type: string,
    data: any,
    headers: any,
    body: any,
    id: any
}

@Injectable({
    providedIn: 'root'
})
export class OfflineManagerService {

    constructor(
        private http: HttpClient, 
        public menuService: MenuService, 
        private messageService: MessageService
    ) { }

    // Helper methods for localStorage
    private async getStorageItem(key: string): Promise<any> {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    private async setStorageItem(key: string, value: any): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value));
    }

    private async removeStorageItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

    checkForEvents(): Observable<any> {
        return from(this.getStorageItem(STORAGE_REQ_KEY)).pipe(
            switchMap(storedOperations => {
                if (storedOperations && storedOperations.length > 0) {
                    console.log('Local data successfully synced to API!');
                    return this.sendRequests(storedOperations).pipe(
                        finalize(() => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Sync Complete',
                                detail: 'Local data successfully synced to API!',
                                life: 3000
                            });
                            this.removeStorageItem(STORAGE_REQ_KEY);
                        })
                    );
                } else {
                    console.log('no local events to sync');
                    return of(false);
                }
            })
        )
    }

    checkForEventsOnClick(): Observable<any> {
        return from(this.getStorageItem(STORAGE_REQ_KEY)).pipe(
            switchMap(storedOperations => {
                if (storedOperations && storedOperations.length > 0) {
                    console.log('Local data successfully synced to API!');
                    return this.sendRequests(storedOperations).pipe(
                        finalize(() => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Sync Complete',
                                detail: 'Local data successfully synced to API!',
                                life: 3000
                            });
                            this.removeStorageItem(STORAGE_REQ_KEY);
                        })
                    );
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'No Data',
                        detail: 'No local events to sync',
                        life: 3000
                    });
                    return of(false);
                }
            })
        )
    }

    async storeRequest(url: string, type: string, data: any, id: any) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Offline Mode',
            detail: 'Your data is stored locally because you seem to be offline.',
            life: 3000
        });

        const action: StoredRequest = {
            url: url,
            type: type,
            data: data,
            body: data,
            id: id,
            headers: '{"Accept":"application/json, text/plain, */*","Content-Type":"multipart/form-data"}'
        };

        const storedOperations = await this.getStorageItem(STORAGE_REQ_KEY);
        const newOperations = storedOperations ? [...storedOperations, action] : [action];
        
        return this.setStorageItem(STORAGE_REQ_KEY, newOperations);
    }

    sendRequests(operations: StoredRequest[]) {
        const obs = [];
        const form1 = new FormData();

        Promise.all([
            this.getStorageItem('FileType'),
            this.getStorageItem('data')
        ]).then(([FileType, storeddata]) => {
            if (FileType && storeddata) {
                form1.append(FileType.name, FileType.data);
                form1.append('data', JSON.stringify(storeddata));
            }
        });

        operations.forEach(op => {
            Promise.all([
                this.getStorageItem(`FileType-${op.id}`),
                this.getStorageItem(`data-${op.id}`)
            ]).then(([FileType, storeddata]) => {
                if (FileType && storeddata) {
                    form1.append(FileType.name, FileType.data);
                    form1.append('data', JSON.stringify(storeddata));

                    const oneObs = this.menuService.Savedata1(
                        37, 
                        JSON.stringify(storeddata), 
                        'samadhan@gmail.com', 
                        FileType
                    ).subscribe(response => {});
                    obs.push(oneObs);
                }
            });
        });

        return forkJoin(obs);
    }

    // Similar implementations for storeRequest1 and sendRequests1
    // ... (follow same pattern as above)

    async getLocal(key: string): Promise<any> {
        return this.getStorageItem(key);
    }

    async getStoredData(): Promise<any> {
        return this.getStorageItem('data');
    }
}