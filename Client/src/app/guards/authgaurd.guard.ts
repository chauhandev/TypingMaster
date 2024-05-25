import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if user is authenticated
    const isAuthenticated = this.checkIfUserIsAuthenticated();

    if (state.url === '/login' || state.url === '/signup' || state.url === '/forgot-password') {
      // If the user is already logged in, redirect them to the dashboard
      if (isAuthenticated) {
        return this.router.navigateByUrl('/dashboard');
      }
      return true; // Allow access to login, register, and forgot password routes if the user is not logged in
    } else if (state.url === '/dashboard') {
      // If the user is on the dashboard page and authenticated, return true
      if (isAuthenticated) {
        return true;
      }
      // If the user is not authenticated and trying to access the dashboard, redirect them to login
      return this.router.navigateByUrl('/login');
    } else {
      // For other routes, check authentication and redirect if necessary
      if (isAuthenticated) {
        return true;
      }
      // If the user is not logged in, redirect them to the login page
      return this.router.navigateByUrl('/login');
    }
  }

  private checkIfUserIsAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }
}
