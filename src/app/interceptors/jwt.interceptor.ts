import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1️⃣ Get the token (try multiple sources for safety)
    const token =
      (this.auth as any).getToken?.() ||
      (this.auth as any).token ||
      localStorage.getItem('token');

    // 2️⃣ Define paths to ignore (auth endpoints and static assets)
    const AUTH_PATHS = ['/auth/login', '/auth/register', '/login', '/register'];
    const isAuthCall = AUTH_PATHS.some(p => req.url.includes(p));
    const isAsset = req.url.includes('/assets/');

    // 3️⃣ Detect API requests (proxy '/api' or full base URL)
    const base = environment.shellApiUrl || '';
    const isApi =
      req.url.startsWith('/api') ||                // Local dev proxy (http://localhost:4200/api)
      (base && req.url.startsWith(base));          // Full backend URL (e.g. http://192.168.74.128:8089/api)

    // 4️⃣ Attach Authorization header only when appropriate
    if (token && !isAuthCall && !isAsset && isApi) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 5️⃣ Continue with the request chain
    return next.handle(req);
  }
}
