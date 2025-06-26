import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-index',
  templateUrl: './bank-index.component.html',
  styleUrls: ['./bank-index.component.scss']
})
export class BankIndexComponent implements OnInit, OnChanges {

  url: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.url = this.router.url;
    console.log("Bank URL:", this.url);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) {
      console.log("Changed URL:", changes['url'].currentValue);
    }
  }
}
