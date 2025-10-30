import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankApiService } from 'src/app/shared/services/bank-api.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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

  natureOptions: string[] = ['ESPECE_PISTE', 'ESPECE_SHOP', 'TRAITE', 'CARTE_BANK'];
  statutOptions: string[] = ['VIDE', 'OK'];

  editId: number | null = null;
  pageIndex = 1;
  readonly pageSize = 6;

  highlightedId: number | null = null;
  private highlightTimer: any = null;
  private qpSub?: Subscription;

  constructor(
    private bankApiService: BankApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.qpSub = this.route.queryParamMap.pipe(
      map(p => Number(p.get('highlight'))),
      filter(id => Number.isFinite(id) && id > 0),
      distinctUntilChanged()
    ).subscribe(id => {
      this.highlightedId = id;
      this.focusHighlightedRow();
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

  onPageIndexChange(i: number) {
    this.pageIndex = i;
    setTimeout(() => this.doScroll(), 0);
  }

  loadOperations(): void {
    this.loadingSpinner = true;
    this.bankApiService.getAlloperations().subscribe({
      next: (data) => {
        this.operations = data ?? [];
        this.loadingSpinner = false;
        this.focusHighlightedRow();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des opérations', err);
        this.loadingSpinner = false;
        this.operations = [];
        this.message.error('Erreur lors du chargement des opérations');
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
        this.message.error('Erreur lors du filtrage');
      }
    });
  }

  toggleForm(): void { this.showForm = !this.showForm; }

  submitOperation(): void {
    this.loadingSpinner = true;
    this.bankApiService.addOperation(this.newOperation).subscribe({
      next: (addedOperation) => {
        this.operations = [addedOperation, ...this.operations];
        this.showForm = false;
        this.resetForm();
        this.loadingSpinner = false;
        this.message.success('Opération ajoutée avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de l’opération', err);
        this.loadingSpinner = false;
        this.message.error('Erreur lors de l’ajout');
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
        this.message.success('Statut mis à jour');
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut', err);
        this.message.error('Erreur lors de la mise à jour du statut');
      }
    });
  }

  private focusHighlightedRow() {
    if (!this.highlightedId || !this.operations?.length) return;
    const idx = this.operations.findIndex(o => o.idBanque === this.highlightedId);
    if (idx === -1) return;
    const targetPage = Math.floor(idx / this.pageSize) + 1;
    if (targetPage !== this.pageIndex) {
      this.pageIndex = targetPage;
      setTimeout(() => this.doScroll(), 50);
    } else {
      this.doScroll();
    }
  }

  private doScroll() {
    if (!this.highlightedId) return;
    clearTimeout(this.highlightTimer);
    const el = document.querySelector(`[data-row-id="${this.highlightedId}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.highlightTimer = setTimeout(() => {
      this.ngZone.run(() => { this.highlightedId = null; });
    }, 3000);
  }

  saveOperation(op: any): void {
    if (!op?.idBanque) return;
    this.bankApiService.updateBanque(op.idBanque, op).subscribe({
      next: () => {
        this.editId = null;
        this.loadOperations();
        this.message.success('Opération mise à jour');
      },
      error: (err) => {
        console.error('Erreur mise à jour opération', err);
        this.message.error('Erreur lors de la mise à jour');
      }
    });
  }

  cancelEdit(): void {
    this.editId = null;
    this.loadOperations();
    this.message.info('Modification annulée');
  }

  // ✅ Modal de suppression
  deleteOperation(op: any): void {
    if (!op?.idBanque) return;

    this.modal.confirm({
      nzTitle: 'Confirmation de suppression',
      nzContent: `Voulez-vous vraiment supprimer l’opération n° ${op.numeroBordereau || op.idBanque} ?`,
      nzOkText: 'Oui',
      nzCancelText: 'Annuler',
      nzOkDanger: true,
      nzWidth: '500px',
      nzCentered: true,
      nzOnOk: () =>
        this.bankApiService.deleteBanque(op.idBanque).subscribe({
          next: () => {
            this.message.success('Opération supprimée avec succès');
            this.loadOperations();
          },
          error: () => this.message.error('Erreur lors de la suppression')
        })
    });
  }
}
