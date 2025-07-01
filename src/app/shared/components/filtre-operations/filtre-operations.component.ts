import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filtre-operations',
  templateUrl: './filtre-operations.component.html',
  styleUrls: ['./filtre-operations.component.scss']
})
export class FiltreOperationsComponent {
  
  // ✅ Événement pour communiquer les filtres au parent
  @Output() filtersChanged = new EventEmitter<{ statut: string, station: string }>();

  // Sélections actuelles
  selectedStatut: string = 'ALL';
  selectedStation: string = 'ALL';

  // Options disponibles
  statutOptions: string[] = ['VIDE', 'OK']; // EN_ATTENTE retiré
  stationOptions: string[] = ['ZAHRA', 'BOUMHAL'];

  // Gestion des changements
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
}
