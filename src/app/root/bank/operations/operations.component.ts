import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankApiService } from 'src/app/shared/services/bank-api.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, OnDestroy {

  operations: any[] = [];
  loadingSpinner = false;

  stationOptions: string[] = ['ZAHRA', 'BOUMHAL'];
  showForm = false;

  newOperation: any = {
    dateOperation: '',
    natureOperationBank: '',
    numeroBordereau: '',
    montant: 0,
    numeroCompte: 20,
    station: ''
  };

  natureOptions: string[] = [
    'ESPECE_PISTE',
    'ESPECE_SHOP',
    'TRAITE',
    'CARTE_BANK'
  ];

  // 🔶 highlight + pagination
  highlightedId: number | null = null;
  private highlightTimer: any = null;
  private qpSub?: Subscription;

  pageIndex = 1;
  readonly pageSize = 6;

  constructor(
    private bankApiService: BankApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Listen to ?highlight changes every time (works even if already on the page)
    this.qpSub = this.route.queryParamMap.pipe(
      map(p => Number(p.get('highlight'))),
      filter(id => Number.isFinite(id) && id > 0),
      distinctUntilChanged()
    ).subscribe(id => {
      this.highlightedId = id;
      this.focusHighlightedRow();

      // remove the param so refresh won't re-trigger
      setTimeout(() => {
        this.router.navigate([], {
          queryParams: { highlight: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }, 0);
    });

    this.loadOperations();
  }

  ngOnDestroy(): void {
    clearTimeout(this.highlightTimer);
    this.qpSub?.unsubscribe();
  }

  // Pagination change handler
  onPageIndexChange(i: number) {
    this.pageIndex = i;
    // try focusing again after page renders
    setTimeout(() => this.doScroll(), 0);
  }

  loadOperations(): void {
    this.loadingSpinner = true;
    this.bankApiService.getAlloperations().subscribe({
      next: (data) => {
        this.operations = data ?? [];
        this.loadingSpinner = false;
        this.focusHighlightedRow(); // may jump to target page, then scroll
      },
      error: (err) => {
        console.error('Erreur lors du chargement des opérations', err);
        this.loadingSpinner = false;
        this.operations = [];
      }
    });
  }

  handleFiltresOperations(filters: { statut: string; station: string }): void {
    const statut = filters.statut !== 'ALL' ? filters.statut : null;
    const station = filters.station !== 'ALL' ? filters.station : null;

    this.loadingSpinner = true;
    this.bankApiService.getFilteredOperations(statut, station).subscribe({
      next: (data) => {
        this.operations = data ?? [];
        this.loadingSpinner = false;
        this.focusHighlightedRow();
      },
      error: () => {
        this.operations = [];
        this.loadingSpinner = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  submitOperation(): void {
    this.loadingSpinner = true;
    this.bankApiService.addOperation(this.newOperation).subscribe({
      next: (addedOperation) => {
        this.operations = [addedOperation, ...this.operations];
        this.showForm = false;
        this.resetForm();
        this.loadingSpinner = false;
        // no highlight on add; only when arriving via notification navigation
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de l’opération', err);
        this.loadingSpinner = false;
      }
    });
  }

  resetForm(): void {
    this.newOperation = {
      dateOperation: '',
      numeroCompte: 20,
      montant: 0,
      station: ''
    };
  }

  getTotalMontant(): number {
    return this.operations.reduce((total, operation) => total + operation.montant, 0);
  }

  onStatutToggle(id: number): void {
    this.bankApiService.updateStatut(id).subscribe({
      next: () => {
        const index = this.operations.findIndex(o => o.idBanque === id);
        if (index !== -1) {
          this.operations[index] = { ...this.operations[index], statut: 'OK' };
        }
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut', err);
      }
    });
  }

  // === Highlight helpers with pagination awareness ===
  private focusHighlightedRow() {
    if (!this.highlightedId || !this.operations?.length) return;

    // find the index of the target row in the full dataset
    const idx = this.operations.findIndex(o => o.idBanque === this.highlightedId);
    if (idx === -1) return;

    // compute target page (1-based)
    const targetPage = Math.floor(idx / this.pageSize) + 1;

    if (targetPage !== this.pageIndex) {
      // jump to that page first; table will re-render
      this.pageIndex = targetPage;
      setTimeout(() => this.doScroll(), 50);
    } else {
      this.doScroll();
    }
  }

  private doScroll() {
    if (!this.highlightedId) return;

    clearTimeout(this.highlightTimer);

    const el = document.querySelector(
      `[data-row-id="${this.highlightedId}"]`
    ) as HTMLElement | null;

    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    this.highlightTimer = setTimeout(() => {
      this.ngZone.run(() => { this.highlightedId = null; });
    }, 3000);
  }
}
