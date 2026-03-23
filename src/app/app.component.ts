import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  title = 'station-sync';

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() >= payload.exp * 1000) {
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);
        }
      } catch (e) {
        // Token is malformed
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
      }
    }
  }

  isAuthPage(): boolean {
    return this.router.url.startsWith('/auth/login') || this.router.url.startsWith('/auth/register');
  }
}