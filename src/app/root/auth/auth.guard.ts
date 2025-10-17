import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token =
      (this.auth as any).getToken?.() ||
      (this.auth as any).token ||
      localStorage.getItem('token');

    return token ? true : this.router.parseUrl('/login');
  }
}
