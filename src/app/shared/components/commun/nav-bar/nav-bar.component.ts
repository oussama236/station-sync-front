import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Notification } from 'src/app/shared/models/notification.model';
import { NotificationApiService } from 'src/app/shared/services/notification-api.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {

  username: string | null = null;
  favoriteLanguage: string = 'FR';
  unreadCount: number = 0;
  recentNotifications: Notification[] = [];
  private routerSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private notificationApi: NotificationApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const rawUsername = this.authService.getUsername?.();
    this.username = rawUsername ? `Mr. ${rawUsername}` : null;

    this.loadUnreadCount();
    this.loadRecentNotifications();

    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadUnreadCount());
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  switchLanguage(language: string) {
    this.favoriteLanguage = language.toUpperCase();
    this.translateService.use(language);
  }

  onLogout(): void {
    this.authService.logout();
  }

  // === Notifications ===
  loadUnreadCount(): void {
    this.notificationApi.getUnreadCount().subscribe({
      next: (count) => (this.unreadCount = Number(count) || 0),
      error: () => (this.unreadCount = 0),
    });
  }

  loadRecentNotifications(): void {
    this.notificationApi.getAllNotifications().subscribe({
      next: (all) => {
        const openOrRead = (all || []).filter(
          (n) => n.status === 'OPEN' || n.status === 'READ'
        );
        // sort desc by creation date
        openOrRead.sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        );
        this.recentNotifications = openOrRead; // ✅ no slice() → show all
      },
      error: () => (this.recentNotifications = []),
    });
  }

  refreshNotifications(): void {
    this.notificationApi.refreshNotifications().subscribe({
      next: () => {
        this.loadUnreadCount();
        this.loadRecentNotifications();
      },
      error: () => {
        this.loadUnreadCount();
        this.loadRecentNotifications();
      },
    });
  }

  onNotificationClick(notif: Notification): void {
    // instantly mark visually as read
    notif.status = 'READ';

    // send API request
    this.notificationApi.markAsRead(notif.id).subscribe({
      next: () => this.loadUnreadCount(),
      error: () => {},
    });

    const highlightParam = { queryParams: { highlight: notif.refId } };
    if (notif.type === 'SHELL') {
      this.router.navigate(['/shell/factures'], highlightParam);
    } else {
      this.router.navigate(['/bank/operations'], highlightParam);
    }
  }
}
