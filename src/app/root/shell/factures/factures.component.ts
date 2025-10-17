import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit, OnDestroy {
  shells: any[] = [];
  loadingSpinner = false;

  showForm = false;
  editId: number | null = null;

  natureOptions: string[] = ['FACTURE_CARBURANT','FACTURE_LUBRIFIANT','LOYER','AVOIR'];
  stationOptions: string[] = ['ZAHRA', 'BOUMHAL'];

  newFacture: any = {
    dateOperation: '',
    numeroFacture: '',
    natureOperation: '',
    montant: 0,
    station: '',
    calculatedDatePrelevement: ''
  };

  // Highlight
  highlightedId: number | null = null;
  private highlightTimer: any = null;
  private qpSub?: Subscription;

  // Pagination
  pageIndex = 1;
  readonly pageSize = 6;

  constructor(
    private shellApiService: ShellApiService,
    private message: NzMessageService,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Listen to ?highlight changes (works even if already on page)
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

    // Load data once
    this.shellApiService.updateStatuts().subscribe({
      next: () => this.loadShells(),
      error: () => this.loadShells()
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.highlightTimer);
    this.qpSub?.unsubscribe();
  }

  // Pagination change from nz-table
  onPageIndexChange(i: number) {
    this.pageIndex = i;
    // After the page content renders, attempt scroll again
    setTimeout(() => this.doScroll(), 0);
  }

  // ===== UI toggles =====
  toggleForm() { this.showForm = !this.showForm; }

  submitFacture() {
    const factureToSend = { ...this.newFacture };
    delete factureToSend.calculatedDatePrelevement;

    this.loadingSpinner = true;
    this.shellApiService.addShell(factureToSend).subscribe({
      next: (addedShell) => {
        this.shells = [addedShell, ...this.shells];
        this.showForm = false;
        this.resetForm();
        this.loadingSpinner = false;
      },
      error: () => { this.loadingSpinner = false; }
    });
  }

  resetForm() {
    this.newFacture = {
      dateOperation: '',
      numeroFacture: '',
      natureOperation: '',
      montant: 0,
      station: '',
      calculatedDatePrelevement: ''
    };
  }

  calculateDatePrelevement() {
    const dateOp = new Date(this.newFacture.dateOperation);
    if (isNaN(dateOp.getTime()) || !this.newFacture.natureOperation) return;

    let result: Date = new Date(dateOp);
    switch (this.newFacture.natureOperation) {
      case 'AVOIR': result.setDate(dateOp.getDate() + 1); break;
      case 'FACTURE_CARBURANT': result.setDate(dateOp.getDate() + 3); break;
      case 'FACTURE_LUBRIFIANT': result = new Date(dateOp.getFullYear(), dateOp.getMonth() + 2, 0); break;
      case 'LOYER': result = new Date(dateOp.getFullYear(), dateOp.getMonth() + 1, 0); break;
    }
    const yyyy = result.getFullYear();
    const mm = String(result.getMonth() + 1).padStart(2, '0');
    const dd = String(result.getDate()).padStart(2, '0');
    this.newFacture.calculatedDatePrelevement = `${yyyy}-${mm}-${dd}`;
  }

  onFiltersChanged(filters: { statut: string, station: string }) {
    const statutParam = filters.statut !== 'ALL' ? filters.statut : null;
    const stationParam = filters.station !== 'ALL' ? filters.station : null;

    this.loadingSpinner = true;
    this.shellApiService.getFilteredShells(statutParam, stationParam).subscribe({
      next: (data) => {
        this.shells = data.shells ?? [];
        this.loadingSpinner = false;
        this.focusHighlightedRow();
      },
      error: () => {
        this.shells = [];
        this.loadingSpinner = false;
      }
    });
  }

  getTotalMontant(): number {
    return this.shells.reduce((total, shell) =>
      shell.natureOperation === 'AVOIR' ? total - shell.montant : total + shell.montant, 0);
  }

  deleteFacture(facture: any): void {
    this.modal.confirm({
      nzTitle: 'Confirmation de suppression',
      nzContent: `Voulez-vous vraiment supprimer la facture n° ${facture.numeroFacture} ?`,
      nzOkText: 'Oui',
      nzCancelText: 'Annuler',
      nzOkDanger: true,
      nzWidth: '500px',
      nzCentered: true,
      nzOnOk: () =>
        this.shellApiService.deleteFacture(facture.idShell).subscribe({
          next: () => { this.message.success('Facture supprimée avec succès'); this.loadShells(); },
          error: () => this.message.error('Erreur lors de la suppression')
        })
    });
  }

  loadShells(): void {
    this.loadingSpinner = true;
    this.shellApiService.getAllShell().subscribe({
      next: (data) => {
        this.shells = data.shells ?? [];
        this.loadingSpinner = false;
        this.focusHighlightedRow(); // may jump to page, then scroll
      },
      error: () => {
        this.shells = [];
        this.loadingSpinner = false;
      }
    });
  }

  saveFacture(facture: any): void {
    if (!facture.idShell) return;

    this.shellApiService.updateShell(facture.idShell, facture).subscribe({
      next: () => {
        this.shellApiService.updateStatuts().subscribe({
          next: () => { this.message.success('Facture mise à jour et statut recalculé'); this.editId = null; this.loadShells(); },
          error: () => { this.message.warning('Facture mise à jour'); this.editId = null; this.loadShells(); }
        });
      },
      error: () => { this.message.error('Erreur lors de la mise à jour'); }
    });
  }

  cancelEdit() { this.editId = null; }

  handleAdvancedSearch(results: any[]): void { this.shells = results ?? []; }

  // === Highlight helpers with pagination awareness ===
  private focusHighlightedRow() {
    if (!this.highlightedId || !this.shells?.length) return;

    // find the index of the target row in the full dataset
    const idx = this.shells.findIndex(s => s.idShell === this.highlightedId);
    if (idx === -1) return;

    // compute target page (1-based)
    const targetPage = Math.floor(idx / this.pageSize) + 1;

    if (targetPage !== this.pageIndex) {
      // jump to that page first; nz-table will re-render
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
