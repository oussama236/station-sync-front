import { Component, OnInit } from '@angular/core';
import { PrelevementApiService } from 'src/app/shared/services/prelevement-api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PrelevementSimulationModalComponent } from '../prelevements/prelevement-simulation-modal/prelevement-simulation-modal.component';
import { FacturesAssocieesModalComponent } from './factures-associees-modal/factures-associees-modal.component';

@Component({
  selector: 'app-prelevements',
  templateUrl: './prelevements.component.html',
  styleUrls: ['./prelevements.component.scss']
})
export class PrelevementsComponent implements OnInit {
  prelevements: any[] = [];
  loadingSpinner = false;

  // Add
  showForm = false;
  newPrelevement: any = { dateOperation: '', numeroCompte: 20, montant: 0 };

  // Edit inline
  editId: number | null = null;
  edited: { dateOperation: string; montant: number } | null = null;

  constructor(
    private prelevementApiService: PrelevementApiService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void { this.loadPrelevements(); }

  // Load
  loadPrelevements(): void {
    this.loadingSpinner = true;
    this.prelevementApiService.getAllPrelevements().subscribe({
      next: (data) => { this.prelevements = data; this.loadingSpinner = false; },
      error: () => { this.loadingSpinner = false; }
    });
  }

  // Add flow
  toggleForm() { this.showForm = !this.showForm; }
  resetForm() { this.newPrelevement = { dateOperation: '', numeroCompte: 20, montant: 0 }; }

  openSimulationModalForAdd(): void {
    const modalRef = this.modal.create({
      nzTitle: "Simulation de l'affectation",
      nzContent: PrelevementSimulationModalComponent,
      nzFooter: null,
      nzWidth: 800,
      nzCentered: true,
      nzData: { montant: this.newPrelevement.montant, dateOperation: this.newPrelevement.dateOperation }
    });

    modalRef.afterOpen.subscribe(() => {
      const instance = modalRef.getContentComponent();
      instance?.simulationConfirmed.subscribe((shellIds: number[]) => this.handleSimulationConfirmAdd(shellIds));
    });
  }

  handleSimulationConfirmAdd(shellIds: number[]) {
    this.loadingSpinner = true;
    this.prelevementApiService.addPrelevement({ ...this.newPrelevement }).subscribe({
      next: (added) => {
        this.prelevementApiService.assignShellsManually(added.idPrelevement, shellIds).subscribe({
          next: (result) => {
            this.prelevements = [result.prelevement, ...this.prelevements];
            this.resetForm(); this.showForm = false; this.loadingSpinner = false;
            this.message.success('Prélèvement ajouté et affecté');
          },
          error: () => { this.loadingSpinner = false; }
        });
      },
      error: () => { this.loadingSpinner = false; }
    });
  }

  // Details modal
  ouvrirModalPrelevements(id: number): void {
    this.prelevementApiService.getPrelevementDetails(id).subscribe(data => {
      this.modal.create({
        nzTitle: 'Factures associées',
        nzContent: FacturesAssocieesModalComponent,
        nzData: { shells: data.shells },
        nzFooter: null,
        nzWidth: 800,
        nzCentered: true
      });
    });
  }

  // Filters callback
  handleResultatsFiltres(resultats: any[]) {
    this.prelevements = resultats;
    this.loadingSpinner = false;
  }

  // Inline edit
  onModify(p: any) {
    this.editId = p.idPrelevement;
    this.edited = { dateOperation: p.dateOperation, montant: p.montant };
  }

  onCancelEdit() {
    this.editId = null;
    this.edited = null;
  }

  onValidateEdit(row: any) {
    if (!this.edited || this.editId !== row.idPrelevement) return;

    // 1) PUT update with shells cleared to FORCE DETACH (frontend-only fix)
    const body = {
      ...row,
      dateOperation: this.edited.dateOperation,
      montant: this.edited.montant,
      shells: [] // ⬅️ crucial: clears old links server-side in updatePrelevement()
    };

    this.loadingSpinner = true;
    this.prelevementApiService.updatePrelevement(row.idPrelevement, body).subscribe({
      next: () => {
        // 2) Open SAME simulation modal prefilled with edited values
        this.openSimulationModalForEdit(row.idPrelevement, this.edited!.montant, this.edited!.dateOperation);
      },
      error: () => { this.loadingSpinner = false; }
    });
  }

  private openSimulationModalForEdit(id: number, montant: number, dateOperation: string) {
    const modalRef = this.modal.create({
      nzTitle: "Simulation de l'affectation",
      nzContent: PrelevementSimulationModalComponent,
      nzFooter: null,
      nzWidth: 800,
      nzCentered: true,
      nzMaskClosable: false, // click outside won't close
      nzKeyboard: false,     // Esc won't close
      nzClosable: false,     // no "X" close icon
      nzData: { montant, dateOperation }
    });

    modalRef.afterOpen.subscribe(() => {
      const instance = modalRef.getContentComponent();
      instance?.simulationConfirmed.subscribe((shellIds: number[]) => {
        // 3) Manual assign with chosen shells (old ones are already detached by step 1)
        this.prelevementApiService.assignShellsManually(id, shellIds).subscribe({
          next: () => {
            this.message.success('Prélèvement mis à jour et réaffecté');
            this.editId = null; this.edited = null;
            this.loadPrelevements(); // simple reload
            this.loadingSpinner = false;
          },
          error: () => { this.loadingSpinner = false; }
        });
      });
    });
  }

  // Delete
  onDelete(p: any) {
    this.modal.confirm({
      nzTitle: 'Supprimer ce prélèvement ?',
      nzContent: `Cette action détachera les factures liées et remettra leur statut à EN_ATTENTE.`,
      nzOkText: 'Supprimer',
      nzCancelText: 'Annuler',
      nzOkDanger: true,
      nzCentered: true,
      nzOnOk: () => {
        this.loadingSpinner = true;
        this.prelevementApiService.deletePrelevement(p.idPrelevement).subscribe({
          next: () => { this.loadPrelevements(); this.message.success('Prélèvement supprimé'); },
          error: () => { this.loadingSpinner = false; }
        });
      }
    });
  }
}
