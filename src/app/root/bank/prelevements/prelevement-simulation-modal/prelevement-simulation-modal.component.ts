import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { PrelevementApiService } from 'src/app/shared/services/prelevement-api.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-prelevement-simulation-modal',
  templateUrl: './prelevement-simulation-modal.component.html',
  styleUrls: ['./prelevement-simulation-modal.component.scss']
})
export class PrelevementSimulationModalComponent implements OnInit {

  montant!: number;
  dateOperation!: string;

  @Output() simulationConfirmed = new EventEmitter<any>();
  @Output() switchToManual = new EventEmitter<void>();

  loading = false;
  exactMatch = false;
  montantAffecte = 0;
  shellSimules: any[] = [];

  modeManuel = false;
  selectedShellIds: number[] = [];
  shellsManuels: any[] = [];

  constructor(
    private prelevementApiService: PrelevementApiService,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    this.montant = data.montant;
    this.dateOperation = data.dateOperation;
  }

  ngOnInit(): void {
    if (this.montant && this.dateOperation) {
      this.simulerAffectation();
    }
  }

  simulerAffectation(): void {
    this.loading = true;
    this.prelevementApiService.simulatePrelevement(this.montant, this.dateOperation).subscribe({
      next: (response) => {
        this.shellSimules = response.shells;
        this.montantAffecte = this.calculerMontant(response.shells);
        this.exactMatch = Math.abs(this.montantAffecte - this.montant) < 0.01;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur simulation :', err);
        this.loading = false;
      }
    });
  }

  allerAffectationManuelle(): void {
    this.modeManuel = true;
    this.loading = true;
    this.shellsManuels = [];
    this.selectedShellIds = [];
    this.montantAffecte = 0;

    this.prelevementApiService.getShellsForManualAssign(this.dateOperation).subscribe({
      next: (shells) => {
        this.shellsManuels = shells.sort((a, b) => new Date(a.datePrelevement).getTime() - new Date(b.datePrelevement).getTime());
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement shells manuels :', err);
        this.loading = false;
      }
    });
  }

  calculerMontant(shells: any[]): number {
    return shells.reduce((total, shell) => {
      const valeur = shell.natureOperation === 'AVOIR' ? -shell.montant : shell.montant;
      return total + valeur;
    }, 0);
  }

  onShellCheckboxChange(shell: any, isChecked: boolean): void {
    if (isChecked) {
      this.selectedShellIds.push(shell.idShell);
    } else {
      this.selectedShellIds = this.selectedShellIds.filter(id => id !== shell.idShell);
    }
  
    const selectedShells = this.shellsManuels.filter(s => this.selectedShellIds.includes(s.idShell));
    this.montantAffecte = this.calculerMontant(selectedShells);
    this.exactMatch = Math.abs(this.montantAffecte - this.montant) < 0.01;
  }
  

  validerSimulation(): void {
    const idsToSend = this.modeManuel ? this.selectedShellIds : this.shellSimules.map(s => s.idShell);
    this.simulationConfirmed.emit(idsToSend);
    this.modal.destroy();
  }

  onShellCheckboxChangeEvent(shell: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    this.onShellCheckboxChange(shell, checked);
  }
  
}
