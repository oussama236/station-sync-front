import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bank-index',
  templateUrl: './bank-index.component.html',
  styleUrls: ['./bank-index.component.scss']
})
export class BankIndexComponent implements OnInit, OnDestroy {

  url: string = "";
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.url = this.router.url;
    console.log("Bank URL:", this.url);
    
    // Subscribe to router navigation events to update URL on navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.url = navEvent.urlAfterRedirects || navEvent.url;
        console.log("Updated Bank URL:", this.url);
      });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    this.routerSubscription.unsubscribe();
  }
}
