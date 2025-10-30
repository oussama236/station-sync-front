import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;

    // 🔹 Skip auth endpoints + static assets
    const SKIP = ['/auth/login', '/auth/register', '/login', '/register', '/assets/'];
    const shouldSkip = SKIP.some(s => req.url.includes(s));

    // ✅ Add Authorization header if we have a token and not skipping
    if (token && !shouldSkip) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // ✅ Add special ngrok header (to bypass browser warning HTML)
    if (req.url.includes('ngrok-free.dev')) {
      req = req.clone({
        setHeaders: {
          ...(token && !shouldSkip ? { Authorization: `Bearer ${token}` } : {}),
          'ngrok-skip-browser-warning': 'true'
        }
      });
    }

    return next.handle(req);
  }
}
