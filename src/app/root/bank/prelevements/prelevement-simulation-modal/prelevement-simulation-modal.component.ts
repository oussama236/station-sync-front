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

  matchType: 'UNIQUE_MATCH' | 'AMBIGUOUS_MATCH' | 'NO_EXACT_MATCH' | null = null;
  numberOfExactSolutions = 0;
  messageInfo = '';

  exactSolutions: any[] = [];
  selectedSolutionIndex: number | null = null;

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
        this.matchType = response.matchType;
        this.numberOfExactSolutions = response.numberOfExactSolutions ?? 0;
        this.exactSolutions = response.exactSolutions || [];
        this.selectedSolutionIndex = null;

        if (response.matchType === 'UNIQUE_MATCH') {
          this.modeManuel = false;
          this.shellSimules = response.shells || [];
          this.shellsManuels = [];
          this.selectedShellIds = [];
          this.montantAffecte = this.calculerMontant(this.shellSimules);
          this.exactMatch = true;
          this.messageInfo = 'Une seule solution a été trouvée. L’affectation automatique est possible.';
        } else if (response.matchType === 'AMBIGUOUS_MATCH') {
          this.modeManuel = false;
          this.shellSimules = [];
          this.shellsManuels = [];
          this.selectedShellIds = [];
          this.montantAffecte = 0;
          this.exactMatch = false;
          this.messageInfo = `(${this.numberOfExactSolutions}) solutions ont été trouvées. Veuillez choisir une solution :`;
          }
          else {
          this.modeManuel = true;
          this.shellSimules = [];
          this.shellsManuels = (response.candidateShells || []).sort(
            (a: any, b: any) =>
              new Date(a.datePrelevement).getTime() - new Date(b.datePrelevement).getTime()
          );
          this.selectedShellIds = [];
          this.montantAffecte = 0;
          this.exactMatch = false;
          this.messageInfo = 'Aucune solution exacte n’a été trouvée. Veuillez choisir manuellement parmi les factures candidates.';
        }

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
    this.matchType = 'NO_EXACT_MATCH';
  
    this.shellsManuels = [];
    this.selectedShellIds = [];
    this.selectedSolutionIndex = null;
  
    // removed:
    // this.exactSolutions = [];
    // this.shellSimules = [];
  
    this.montantAffecte = 0;
    this.exactMatch = false;
  
    this.prelevementApiService.getShellsForManualAssign(this.dateOperation).subscribe({
      next: (shells) => {
        this.shellsManuels = shells.sort(
          (a, b) =>
            new Date(a.datePrelevement).getTime() -
            new Date(b.datePrelevement).getTime()
        );
  
        this.messageInfo = 'Affectation manuelle activée.';
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
      if (!this.selectedShellIds.includes(shell.idShell)) {
        this.selectedShellIds.push(shell.idShell);
      }
    } else {
      this.selectedShellIds = this.selectedShellIds.filter(id => id !== shell.idShell);
    }

    const selectedShells = this.shellsManuels.filter(s => this.selectedShellIds.includes(s.idShell));
    this.montantAffecte = this.calculerMontant(selectedShells);
    this.exactMatch = Math.abs(this.montantAffecte - this.montant) < 0.01;
  }

  onShellCheckboxChangeEvent(shell: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onShellCheckboxChange(shell, input.checked);
  }

  choisirSolution(index: number): void {
    this.selectedSolutionIndex = index;
    const solution = this.exactSolutions[index];
    const solutionShells = solution?.shells || [];

    this.selectedShellIds = solutionShells.map((s: any) => s.idShell);
    this.montantAffecte = this.calculerMontant(solutionShells);
    this.exactMatch = Math.abs(this.montantAffecte - this.montant) < 0.01;
  }

  isSolutionSelected(index: number): boolean {
    return this.selectedSolutionIndex === index;
  }


  retourAuxSolutions(): void {
    this.modeManuel = false;
  
    this.shellsManuels = [];
    this.selectedShellIds = [];
  
    if (this.numberOfExactSolutions === 1) {
  
      this.matchType = 'UNIQUE_MATCH';
  
      this.montantAffecte = this.calculerMontant(this.shellSimules);
  
      this.exactMatch = true;
  
      this.messageInfo =
        'Une seule solution a été trouvée. L’affectation automatique est possible.';
  
    } else {
  
      this.matchType = 'AMBIGUOUS_MATCH';
  
      this.montantAffecte = 0;
  
      this.exactMatch = false;
  
      this.messageInfo =
        `(${this.numberOfExactSolutions}) solutions ont été trouvées. Veuillez choisir une solution :`;
    }
  }

  formatNature(nature: string): string {
    switch (nature) {
      case 'FACTURE_CARBURANT':
        return 'Carburant';
      case 'FACTURE_LUBRIFIANT':
        return 'Lubrifiant';
      case 'AVOIR':
        return 'Avoir';
      case 'LOYER':
        return 'Loyer';
      default:
        return nature;
    }
  }

  validerSimulation(): void {
    let idsToSend: number[] = [];

    if (this.matchType === 'UNIQUE_MATCH') {
      idsToSend = this.shellSimules.map(s => s.idShell);
    } else {
      idsToSend = this.selectedShellIds;
    }

    this.simulationConfirmed.emit(idsToSend);
    this.modal.destroy();
  }
}