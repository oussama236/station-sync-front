import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankApiService } from 'src/app/shared/services/bank-api.service';
import { PrelevementApiService } from 'src/app/shared/services/prelevement-api.service';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  navigationLoading: boolean = false;
  totalShellsLoading: boolean = false;
  totalOperationsLoading: boolean = false;
  totalPrelevementLoading: boolean = false;

  totalShells: number = 0;
  totalOperations: number = 0;
  totalPrelevement: number = 0;
  lastShells: any[] = [];
  lastOperations: any[] = [];
  lastPrelevements: any[] = [];

  constructor(
    private router: Router,
    private shellApiService: ShellApiService,
    private banlApiService: BankApiService,
    private prelevementApiService: PrelevementApiService
  ) {}

  ngOnInit(): void {
    this.loadShells();
    this.loadOperations();
    this.loadPrelevements();
  }

  handleRedirect(path: string) {
    this.navigationLoading = true;
    switch (path) {
      case 'factures':
        setTimeout(() => {
          this.router.navigate(['/shell/factures']);
          this.navigationLoading = false;
        }, 1000);
        break;

      case 'operations':
        setTimeout(() => {
          this.router.navigate(['/bank/operations']);
          this.navigationLoading = false;
        }, 1000);
        break;

      case 'prelevements':
        setTimeout(() => {
          this.router.navigate(['/bank/prelevements']);
          this.navigationLoading = false;
        }, 1000);
        break;

      default:
        this.router.navigate(['/home']);
    }
  }

  loadShells() {
    this.totalShellsLoading = true;
    this.shellApiService.getAllShell().subscribe({
      next: (data: any) => {
        this.totalShells = data.totalCount;
        this.lastShells = data.shells.sort(
          (a: any, b: any) =>
            new Date(b.dateOperation).getTime() -
            new Date(a.dateOperation).getTime()
        );
        console.log('lastShells', this.lastShells);
      },
      error: (err: any) => {
        console.error('Error loading shells', err);
      },
      complete: () => {
        setTimeout(() => {
          this.totalShellsLoading = false;
        }, 1000);
      },
    });
  }

  loadOperations() {
    this.totalOperationsLoading = true;
    this.banlApiService.getAlloperations().subscribe({
      next: (data: any) => {
        this.totalOperations =
          Array.isArray(data) && data.length > 0 ? data.length : 0;
        this.lastOperations = data.sort(
          (a: any, b: any) =>
            new Date(b.dateOperation).getTime() -
            new Date(a.dateOperation).getTime()
        );
        console.log('lastOperations', this.lastOperations);
      },
      error: (err: any) => {
        console.error('Error loading operations', err);
      },
      complete: () => {
        setTimeout(() => {
          this.totalOperationsLoading = false;
        }, 1000);
      },
    });
  }

  loadPrelevements() {
    this.totalPrelevementLoading = true;
    this.prelevementApiService.getAllPrelevements().subscribe({
      next: (data: any) => {
        this.totalPrelevement =
          Array.isArray(data) && data.length > 0 ? data.length : 0;
        this.lastPrelevements = data.sort(
          (a: any, b: any) =>
            new Date(b.dateOperation).getTime() -
            new Date(a.dateOperation).getTime()
        );
        console.log('totalPrelevement', this.totalPrelevement);
      },
      error: (err: any) => {
        console.error('Error loading prelevements', err);
      },
      complete: () => {
        setTimeout(() => {
          this.totalPrelevementLoading = false;
        }, 1000);
      },
    });
  }
}
