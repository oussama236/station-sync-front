import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell-index',
  templateUrl: './shell-index.component.html',
  styleUrls: ['./shell-index.component.scss']
})
export class ShellIndexComponent implements OnInit, OnChanges {

  url: string = "";

  constructor(private router: Router){}

  ngOnInit(): void {
    this.url = this.router.url;
    console.log("url", this.url)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes){
      console.log("changed", changes['url'].currentValue)
    }
  };

}
