import { PrelevementApiService } from 'src/app/shared/services/prelevement-api.service';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filters-prelevements',
  templateUrl: './filters-prelevements.component.html',
  styleUrls: ['./filters-prelevements.component.scss']
})
export class FiltersPrelevementsComponent {

  selectedDate: string = '';
  selectedMontant: number | null = null;

  @Output() filtresAppliques = new EventEmitter<any[]>();
  @Output() filtresStarted = new EventEmitter<void>(); // ✅ Ajout pour le spinner dans le parent

  constructor(private prelevementApiService: PrelevementApiService) {}

  lancerRecherche() {
    this.filtresStarted.emit(); // ✅ Signale au parent que le chargement commence

    this.prelevementApiService.searchPrelevements(
      this.selectedDate || undefined,
      this.selectedMontant !== null ? this.selectedMontant : undefined
    ).subscribe({
      next: (data) => {
        this.filtresAppliques.emit(data); // ✅ Résultats reçus → émis au parent
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
      }
    });
  }

  reinitialiserFiltres() {
    this.selectedDate = '';
    this.selectedMontant = null;

    this.filtresStarted.emit(); // ✅ Signale aussi au parent que ça charge

    this.prelevementApiService.getAllPrelevements().subscribe({
      next: (data) => {
        this.filtresAppliques.emit(data);
      },
      error: (err) => {
        console.error('Erreur lors du rechargement :', err);
      }
    });
  }
}
