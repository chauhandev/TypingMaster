import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 

  private baseURl = '';//'http://localhost:3000/api/auth/'; // Replace with your actual backend API URL
  isLoggedIn = new BehaviorSubject<boolean>(this.checkIfUserIsAuthenticated());
  
  constructor(private http: HttpClient) {}

  signup(user: User): Observable<any> {
    const url = `${this.baseURl}/signup`;
    return this.http.post(url, user);
  }

  login(data: any) {
    const url = `${this.baseURl}/login`;
    return this.http.post(url, data);     
   }

  loggedIn(value : boolean): void {
    this.isLoggedIn.next(value);
  }

  // logout(): void {
  //   this.isLoggedIn.next(false);
  //   localStorage.clear();
  // }

  getUserInfo(): { profilePic: string, name: string } {
    return {
      profilePic: 'path_to_profile_pic',
      name: 'User Name'
    };
  }

  private checkIfUserIsAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }
}
