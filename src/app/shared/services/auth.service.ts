import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

type Decoded = { username?: string; sub?: string; exp?: number };

const TOKEN_KEYS = ['token', 'access_token']; // tolerate both
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {
    // Optional: migrate legacy key to a single canonical key ('token')
    const legacy = localStorage.getItem('access_token');
    const canonical = localStorage.getItem('token');
    if (!canonical && legacy) {
      localStorage.setItem('token', legacy);
      localStorage.removeItem('access_token');
    }
  }

  /** Prefer reading via this getter everywhere */
  get token(): string | null {
    for (const k of TOKEN_KEYS) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }
    return null;
  }

  /** Use this in your login success to store the token */
  setToken(token: string): void {
    localStorage.setItem('token', token); // canonical
    localStorage.removeItem('access_token'); // clean alias
  }

  getUsername(): string | null {
    const t = this.token;
    if (!t) return null;
    try {
      const d = jwtDecode<Decoded>(t);
      return d.username ?? d.sub ?? null;
    } catch {
      return null;
    }
  }

  /** Clear ALL possible token keys + user and go to /login */
  logout(): void {
    TOKEN_KEYS.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem(USER_KEY);
    this.router.navigateByUrl('/login');
  }
}
