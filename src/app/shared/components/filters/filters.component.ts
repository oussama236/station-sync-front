import { Component, EventEmitter, Output } from '@angular/core';
import { ShellSearchCriteria } from 'src/app/shared/models/shell-search-criteria';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {

  ngOnInit(): void {
    console.log('Stations disponibles :', this.stationOptions);
  }
  
  visible = false;

  // ✅ Événements pour communication avec le parent
  @Output() filtersChanged = new EventEmitter<{ statut: string, station: string }>();
  @Output() advancedSearchResult = new EventEmitter<any>();

  // Critères de recherche avancée
  searchCriteria: ShellSearchCriteria = {
    stations: [],natures: [],
    statuts: [],
  };

  // Valeurs sélectionnées pour les filtres simples
  selectedStatut: string = 'ALL';
  selectedStation: string = 'ALL';

  enableExactDateOperation = false;
enablePeriodOperation = false;
enableExactMontant = false;
enableMontantRange = false;
enableNumeroFacture = false;
enableExactDatePrelevement = false;
enablePeriodPrelevement = false;
enableNature = false;
enableStatut = false;
enableStation = false;


  // Options pour les filtres
  natureOptions: string[] = ['FACTURE_CARBURANT', 'AVOIR', 'LOYER', 'FACTURE_LUBRIFIANT'];
statutOptions: string[] = ['VIDE', 'EN_ATTENTE', 'OK'];

  
  stationOptions: string[] = ['ZAHRA', 'BOUMHAL'];


  constructor(private shellService: ShellApiService) {}

  // Ouvre le drawer
  open(): void {
    this.visible = true;
  }

  // Ferme le drawer
  close(): void {
    this.visible = false;
  }

  // ✅ Gestion des filtres simples (statut/station)
  onStatutChange(statut: string): void {
    this.selectedStatut = statut;
    if (statut === 'ALL') {
      this.selectedStation = 'ALL';
    }
    this.emitFilters();
  }

  onStationChange(station: string): void {
    this.selectedStation = station;
    this.emitFilters();
  }

  resetAllFilters(): void {
    this.selectedStatut = 'ALL';
    this.selectedStation = 'ALL';
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChanged.emit({
      statut: this.selectedStatut,
      station: this.selectedStation
    });
  }

  // ✅ Recherche avancée via API
  search(): void {
    // Nettoyage des critères non cochés
    if (!this.enableExactDateOperation) this.searchCriteria.exactDateOperation = undefined;
    if (!this.enablePeriodOperation) {
      this.searchCriteria.startDateOperation = undefined;
      this.searchCriteria.endDateOperation = undefined;
    }
  
    if (!this.enableExactMontant) this.searchCriteria.exactMontant = undefined;
    if (!this.enableMontantRange) {
      this.searchCriteria.minMontant = undefined;
      this.searchCriteria.maxMontant = undefined;
    }
  
    if (!this.enableNumeroFacture) this.searchCriteria.numeroFacture = undefined;
  
    if (!this.enableExactDatePrelevement) this.searchCriteria.exactDatePrelevement = undefined;
    if (!this.enablePeriodPrelevement) {
      this.searchCriteria.startDatePrelevement = undefined;
      this.searchCriteria.endDatePrelevement = undefined;
    }
  
    if (!this.enableNature) this.searchCriteria.natures = [];
    if (!this.enableStatut) this.searchCriteria.statuts = [];
    if (!this.enableStation) this.searchCriteria.stations = [];
  
    // Appel API
    this.shellService.searchShells(this.searchCriteria).subscribe({
      next: (result) => {
        console.log('Résultats recherche avancée :', result);
        this.advancedSearchResult.emit(result);
        this.close();
      },
      error: (err) => {
        console.error('Erreur recherche avancée :', err);
      }
    });
  }

  onStationCheckboxChange(event: any): void {
    const value = event.target.value;
    const isChecked = event.target.checked;
  
    if (!this.searchCriteria.stations) {
      this.searchCriteria.stations = [];
    }
  
    if (isChecked) {
      if (!this.searchCriteria.stations.includes(value)) {
        this.searchCriteria.stations.push(value);
      }
    } else {
      this.searchCriteria.stations = this.searchCriteria.stations.filter(v => v !== value);
    }
  }

  onNatureCheckboxChange(event: any): void {
    const value = event.target.value;
    const isChecked = event.target.checked;
  
    if (!this.searchCriteria.natures) {
      this.searchCriteria.natures = [];
    }
  
    if (isChecked) {
      if (!this.searchCriteria.natures.includes(value)) {
        this.searchCriteria.natures.push(value);
      }
    } else {
      this.searchCriteria.natures = this.searchCriteria.natures.filter(v => v !== value);
    }
  }
  
  onStatutCheckboxChange(event: any): void {
    const value = event.target.value;
    const isChecked = event.target.checked;
  
    if (!this.searchCriteria.statuts) {
      this.searchCriteria.statuts = [];
    }
  
    if (isChecked) {
      if (!this.searchCriteria.statuts.includes(value)) {
        this.searchCriteria.statuts.push(value);
      }
    } else {
      this.searchCriteria.statuts = this.searchCriteria.statuts.filter(v => v !== value);
    }
  }
  
  
  
}
