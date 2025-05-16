import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  navigationLoading: boolean = false;
  elementLoading: boolean = false;

  constructor(private router: Router){
  }

  ngOnInit(): void {
    this.elementLoading = true;
    setTimeout(() => {
      this.elementLoading = false;
    }, 1000)
  };

  goToBank(){
    this.navigationLoading = true;
    setTimeout(() => {
      this.router.navigate(['/shell/factures']);
      this.navigationLoading = false;
    }, 1000)
  }
}
