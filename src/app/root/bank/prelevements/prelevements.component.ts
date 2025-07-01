import { Component, OnInit } from '@angular/core';
import { PrelevementApiService } from 'src/app/shared/services/prelevement-api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
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
  showSimulationModal = false;
  shellIdsSimules: number[] = [];
  facturesAssociees: any[] = [];
  modalVisible: boolean = false;

  showForm = false;

  newPrelevement: any = {
    dateOperation: '',
    numeroCompte: 20,
    montant: 0
  };

  constructor(
    private prelevementApiService: PrelevementApiService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadPrelevements();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  resetForm() {
    this.newPrelevement = {
      dateOperation: '',
      numeroCompte: 20,
      montant: 0
    };
  }

  openSimulationModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Simulation de l\'affectation',
      nzContent: PrelevementSimulationModalComponent,
      nzFooter: null,
      nzWidth: 800,
      nzCentered: true,
      nzData: {
        montant: this.newPrelevement.montant,
        dateOperation: this.newPrelevement.dateOperation
      }
    });

    modalRef.afterOpen.subscribe(() => {
      const instance = modalRef.getContentComponent();
      if (instance) {
        instance.simulationConfirmed.subscribe((shellIds: number[]) => {
          this.handleSimulationConfirm(shellIds);
        });

        instance.switchToManual.subscribe(() => {
          console.log("Utilisateur a choisi l'affectation manuelle");
        });
      }
    });
  }

  handleSimulationConfirm(shellIds: number[]) {
    const prelevementToSend = { ...this.newPrelevement };
    this.loadingSpinner = true;

    this.prelevementApiService.addPrelevement(prelevementToSend).subscribe({
      next: (addedPrelevement) => {
        this.prelevementApiService.assignShellsManually(addedPrelevement.idPrelevement, shellIds).subscribe({
          next: (result) => {
            this.prelevements = [result.prelevement, ...this.prelevements];
            this.resetForm();
            this.showForm = false;
            this.showSimulationModal = false;
            this.loadingSpinner = false;
          },
          error: (err) => {
            console.error('Erreur assignation manuelle', err);
            this.loadingSpinner = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur ajout prélèvement', err);
        this.loadingSpinner = false;
      }
    });
  }

  loadPrelevements(): void {
    this.loadingSpinner = true;
    this.prelevementApiService.getAllPrelevements().subscribe({
      next: (data) => {
        this.prelevements = data;
        this.loadingSpinner = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des prélèvements :', err);
        this.loadingSpinner = false;
      }
    });
  }

  ouvrirModalPrelevements(prelevementId: number): void {
    this.prelevementApiService.getPrelevementDetails(prelevementId).subscribe(data => {
      this.modal.create({
        nzTitle: 'Factures associées',
        nzContent: FacturesAssocieesModalComponent,
        nzData: {
          shells: data.shells
        },
        nzFooter: null,
        nzWidth: 800,
        nzCentered: true
      });
    });
  }

  // ✅ appelé quand les résultats filtrés sont reçus
  handleResultatsFiltres(resultats: any[]) {
    this.prelevements = resultats;
    this.loadingSpinner = false; // ✅ arrêt du spinner ici
  }
}
