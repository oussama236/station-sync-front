import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  navigationLoading: boolean = false;
  elementLoading: boolean = false;
  totalShells: number = 0;
  shells: any[] = [];         

  constructor(private router: Router,private shellApiService: ShellApiService){
  }

  ngOnInit(): void {
    this.loadShells();
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

  loadShells() {
    this.shellApiService.getAllShell().subscribe({
      next: (data: any) => {
        console.log('Shells loaded:', data); // ✅ verify response
        this.shells = data.shells;            // 👈 extract the array
        this.totalShells = data.totalCount;   // 👈 get total count directly
        console.log('Total shells:', this.totalShells);
      },
      error: (err: any) => {
        console.error('Error loading shells', err);
      }
    });
  }
  
  
  
  
}
