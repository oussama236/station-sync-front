import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  @Input() url: string = "";
  pathNames: string[] = [];
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Use input URL if provided, otherwise get current URL
    this.url = this.url || this.router.url;
    this.updatePathNames();
    
    // Subscribe to router navigation events to update breadcrumb on navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.url = navEvent.urlAfterRedirects || navEvent.url;
        this.updatePathNames();
      });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    this.routerSubscription.unsubscribe();
  }

  private updatePathNames(): void {
    this.pathNames = this.url.split('/').filter(segment => segment !== '');
  }
}
