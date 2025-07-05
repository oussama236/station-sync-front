import { Component, OnInit } from '@angular/core';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})

export class FacturesComponent implements OnInit {

  shells: any[] = [];
  loadingSpinner = false;

  // Affichage du formulaire
  showForm = false;

  // Liste des options pour natureOperation
  natureOptions: string[] = [
    'FACTURE_CARBURANT',
    'FACTURE_LUBRIFIANT',
    'LOYER',
    'AVOIR'
  ];

  // Liste des options pour station
  stationOptions: string[] = ['ZAHRA', 'BOUMHAL'];

  // Objet pour formulaire
  newFacture: any = {
    dateOperation: '',
    numeroFacture: '',
    natureOperation: '',
    montant: 0,
    station: '',
    calculatedDatePrelevement: '' // Ajout champ visuel
  };

  constructor(private shellApiService: ShellApiService,
    private message: NzMessageService,
    private modal: NzModalService) { }

    

  ngOnInit(): void {
    console.log('natureOptions =', this.natureOptions);
    this.loadingSpinner = true;
    this.shellApiService.getAllShell().subscribe({
      next: (data) => {
        this.shells = data.shells ?? [];
        this.loadingSpinner = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données Shells', err);
        this.loadingSpinner = false;
      }
    });

    this.shellApiService.updateStatuts().subscribe({
      next: () => {
        // Statuts mis à jour, maintenant charger les données :
        this.loadShells();
      },
      error: () => {
        // Même en cas d’erreur, on continue
        this.loadShells();
      }
    });

  }

  editId: number | null = null;


  // Affiche ou cache le formulaire
  toggleForm() {
    this.showForm = !this.showForm;
  }

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
      error: (err) => {
        console.error('Erreur lors de l’ajout de la facture', err);
        this.loadingSpinner = false;
      }
    });
  }


  // Réinitialise les champs du formulaire
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

  // Calcul automatique de la date de prélèvement
  calculateDatePrelevement() {
    const dateOp = new Date(this.newFacture.dateOperation);
  
    // Vérification que la date est valide et que la nature est renseignée
    if (isNaN(dateOp.getTime()) || !this.newFacture.natureOperation) return;
  
    let result: Date = new Date(dateOp);
  
    switch (this.newFacture.natureOperation) {
      case 'AVOIR':
        result.setDate(dateOp.getDate() + 1);
        break;
      case 'FACTURE_CARBURANT':
        result.setDate(dateOp.getDate() + 3);
        break;
      case 'FACTURE_LUBRIFIANT':
        // Dernier jour du mois suivant le mois prochain (mois + 2 - jour = 0)
        result = new Date(dateOp.getFullYear(), dateOp.getMonth() + 2, 0);
        break;
      case 'LOYER':
        // Dernier jour du mois suivant (mois + 1 - jour = 0)
        result = new Date(dateOp.getFullYear(), dateOp.getMonth() + 1, 0);
        break;
    }
  
    // Formatage sans utiliser toISOString() (évite bug de décalage UTC)
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
      },
      error: () => {
        this.shells = []; // si aucun résultat
        this.loadingSpinner = false;
      }
    });
  }

  getTotalMontant(): number {
    return this.shells.reduce((total, shell) => {
      if (shell.natureOperation === 'AVOIR') {
        return total - shell.montant; // ✅ soustraire l'avoir
      } else {
        return total + shell.montant; // ✅ ajouter normalement
      }
    }, 0);
  }
  


  deleteFacture(facture: any): void {
    this.modal.confirm({
      nzTitle: 'Confirmation de suppression',
      nzContent: `Voulez-vous vraiment supprimer la facture n° ${facture.numeroFacture} ?`,
      nzOkText: 'Oui',
      nzCancelText: 'Annuler',
      nzOkDanger: true,
      nzWidth: '500px', // ✅ taille personnalisée
      nzCentered: true, // ✅ centrer verticalement la modale
      nzOnOk: () =>
        this.shellApiService.deleteFacture(facture.idShell).subscribe({
          next: () => {
            this.message.success('Facture supprimée avec succès');
            this.loadShells();
          },
          error: () => {
            this.message.error('Erreur lors de la suppression');
          }
        })
    });
  }


  loadShells(): void {
    this.loadingSpinner = true;
    this.shellApiService.getAllShell().subscribe({
      next: (data) => {
        this.shells = data.shells ?? [];
        this.loadingSpinner = false;
      },
      error: (err) => {
        console.error('Erreur lors du rechargement des Shells', err);
        this.shells = [];
        this.loadingSpinner = false;
      }
    });
  }


  saveFacture(facture: any): void {
    if (!facture.idShell) return;

    this.shellApiService.updateShell(facture.idShell, facture).subscribe({
      next: () => {
        // Appel pour recalculer les statuts si la date de prélèvement a changé
        this.shellApiService.updateStatuts().subscribe({
          next: () => {
            this.message.success('Facture mise à jour et statut recalculé');
            this.editId = null; // ⛔ Sortir du mode édition
            this.loadShells();  // 🔁 Recharger les données
          },
          error: () => {
            this.message.warning('Facture mise à jour');
            this.editId = null;
            this.loadShells();
          }
        });
      },
      error: (err) => {
        this.message.error('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }


  cancelEdit() {
    this.editId = null;
    // Optionally re-fetch data if you want to discard changes:
    // this.loadShells(); 
  }
  

  handleAdvancedSearch(results: any[]): void {
    this.shells = results ?? [];
  }
  



}
