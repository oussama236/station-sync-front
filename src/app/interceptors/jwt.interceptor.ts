import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;


    const SKIP = ['/auth/login', '/auth/register', '/login', '/register', '/assets/'];
    const shouldSkip = SKIP.some(s => req.url.includes(s));

    if (token && !shouldSkip) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    if (req.url.includes('ngrok-free.dev')) {
      req = req.clone({
        setHeaders: {
          ...(token && !shouldSkip ? { Authorization: `Bearer ${token}` } : {}),
          'ngrok-skip-browser-warning': 'true'
        }
      });
    }

    // 👇 Only this line changes
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}