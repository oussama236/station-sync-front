import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  
  username: string | null = null;
  favoriteLanguage: string = 'FR'
  
  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const rawUsername = this.authService.getUsername();
    this.username = rawUsername ? `Mr. ${rawUsername}` : null;
  }

  switchLanguage(language: string){
    this.favoriteLanguage = language.toLocaleUpperCase();
    this.translateService.use(language);
  }
  
}
