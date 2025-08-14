import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {}
  title = 'station-sync';

  isAuthPage(): boolean {
    return this.router.url.startsWith('/auth/login') || this.router.url.startsWith('/auth/register');
  }
}
