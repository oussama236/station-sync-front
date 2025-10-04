import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // check if token exists
    if (token) {
      return true; // ✅ allow access
    } else {
      // 🚫 no token → redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
