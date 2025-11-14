import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-index',
  templateUrl: './ai-index.component.html',
  styleUrls: ['./ai-index.component.scss']
})
export class AiIndexComponent implements OnInit, OnDestroy {
  url = '';
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.url = this.router.url;
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.url = event?.urlAfterRedirects || event?.url || this.url;
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
