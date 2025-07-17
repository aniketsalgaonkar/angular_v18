import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  apiUrl = environment.apiUrl;
  currentUser = signal<IUser | null>(null);

  constructor(private http: HttpClient) { }

  login(model: any): Observable<IUser> {
    const formData = new FormData();
    formData.append('UserName', model.username);
    formData.append('Password', model.password);
    return this.http.post<IUser>(`${this.apiUrl}` + `api/Login/ValidateUser`, formData).pipe(
      map((response: IUser) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
      })
    )
  }

  setCurrentUser(user: IUser | null) {
    this.currentUser.set(user);
  }
} 