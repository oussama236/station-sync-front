import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // adapte si ton token contient 'username' ou autre
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.sub; // change en decoded.username si nécessaire
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
        return null;
      }
    }
    return null;
  }
}
