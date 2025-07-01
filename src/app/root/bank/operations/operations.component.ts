import { Component, OnInit } from '@angular/core';
import { BankApiService } from 'src/app/shared/services/bank-api.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {

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




  constructor(private bankApiService: BankApiService) {}

  ngOnInit(): void {
    this.loadOperations();
  }

  loadOperations(): void {
    this.loadingSpinner = true;
    this.bankApiService.getAlloperations().subscribe({
      next: (data) => {
        this.operations = data ?? [];
        this.loadingSpinner = false;
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
        // Crée une copie pour forcer Angular à détecter le changement
        this.operations[index] = {
          ...this.operations[index],
          statut: 'OK'
        };
      }
    },
    error: (err) => {
      console.error('Erreur lors du changement de statut', err);
    }
  });
}



}
