import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankApiService } from 'src/app/shared/services/bank-api.service';
import { PrelevementApiService } from 'src/app/shared/services/prelevement-api.service';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';

interface HasDateOp { dateOperation?: string | Date | null; }

interface ShellItem extends HasDateOp {
  natureOperation?: string;
  montant?: number;
  // add other shell fields if you have them
}

interface OperationItem extends HasDateOp {
  natureOperationBank?: string;
  montant?: number;
  // add other operation fields if you have them
}

interface PrelevementItem extends HasDateOp {
  numeroCompte?: string;
  montant?: number;
  // add other prelevement fields if you have them
}

function toDate(d: any): Date | null {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

function sortByDateDesc<T extends HasDateOp>(a: T, b: T): number {
  const tb = b?.dateOperation ? toDate(b.dateOperation) : null;
  const ta = a?.dateOperation ? toDate(a.dateOperation) : null;
  return (tb?.getTime?.() || 0) - (ta?.getTime?.() || 0);
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  navigationLoading = false;
  totalShellsLoading = false;
  totalOperationsLoading = false;
  totalPrelevementLoading = false;

  totalShells = 0;
  totalOperations = 0;
  totalPrelevement = 0;

  lastShells: ShellItem[] = [];
  lastOperations: OperationItem[] = [];
  lastPrelevements: PrelevementItem[] = [];

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
    const go = (url: string) => {
      this.router.navigate([url]);
      this.navigationLoading = false;
    };
    switch (path) {
      case 'factures':     setTimeout(() => go('/shell/factures'), 1000); break;
      case 'operations':   setTimeout(() => go('/bank/operations'), 1000); break;
      case 'prelevements': setTimeout(() => go('/bank/prelevements'), 1000); break;
      default:             go('/home');
    }
  }

  loadShells() {
    this.totalShellsLoading = true;
    this.shellApiService.getAllShell().subscribe({
      next: (data: any) => {
        // 👇 Debug: see the raw payload from the backend
        console.log('Shells raw data:', data);
  
        // Normalize the array (works if backend returns { shells, totalCount } or a plain array)
        const shellsArr = Array.isArray(data?.shells)
          ? data.shells
          : Array.isArray(data)
          ? data
          : [];
  
        this.totalShells = Number.isFinite(data?.totalCount)
          ? data.totalCount
          : shellsArr.length;
  
        // 👇 Map montant defensively in case the field name differs or is a string
        this.lastShells = shellsArr
          .filter(Boolean)
          .map((s: any) => ({
            ...s,
            // pick the right amount field if backend uses another name
            montant: s?.montant ?? s?.amount ?? s?.total ?? 0,
            // ensure date is a real Date for the date pipe
            dateOperation: s?.dateOperation ? new Date(s.dateOperation) : null,
          }))
          .sort((a: any, b: any) =>
            (b.dateOperation?.getTime?.() || 0) - (a.dateOperation?.getTime?.() || 0)
          );
  
        console.log('lastShells (normalized):', this.lastShells);
      },
      error: (err: any) => {
        console.error('Error loading shells', err);
        this.lastShells = [];
        this.totalShells = 0;
      },
      complete: () => {
        setTimeout(() => (this.totalShellsLoading = false), 1000);
      },
    });
  }
  
  loadOperations() {
    this.totalOperationsLoading = true;
    this.banlApiService.getAlloperations().subscribe({
      next: (data: any) => {
        const ops: OperationItem[] = Array.isArray(data) ? data : [];
        this.totalOperations = ops.length;

        this.lastOperations = ops
          .filter(Boolean)
          .map(o => ({ ...o, dateOperation: toDate(o?.dateOperation) }))
          .sort(sortByDateDesc);

        console.log('lastOperations', this.lastOperations);
      },
      error: (err: any) => {
        console.error('Error loading operations', err);
        this.lastOperations = [];
        this.totalOperations = 0;
      },
      complete: () => {
        setTimeout(() => (this.totalOperationsLoading = false), 1000);
      },
    });
  }

  loadPrelevements() {
    this.totalPrelevementLoading = true;
    this.prelevementApiService.getAllPrelevements().subscribe({
      next: (data: any) => {
        const arr: PrelevementItem[] = Array.isArray(data) ? data : [];
        this.totalPrelevement = arr.length;

        this.lastPrelevements = arr
          .filter(Boolean)
          .map(p => ({ ...p, dateOperation: toDate(p?.dateOperation) }))
          .sort(sortByDateDesc);

        console.log('totalPrelevement', this.totalPrelevement);
      },
      error: (err: any) => {
        console.error('Error loading prelevements', err);
        this.lastPrelevements = [];
        this.totalPrelevement = 0;
      },
      complete: () => {
        setTimeout(() => (this.totalPrelevementLoading = false), 1000);
      },
    });
  }
}
