import { Component } from '@angular/core';

@Component({
  selector: 'app-filters-prelevements',
  templateUrl: './filters-prelevements.component.html',
  styleUrls: ['./filters-prelevements.component.scss']
})
export class FiltersPrelevementsComponent {

  selectedDate: string = '';
  selectedMontant: number | null = null;


}
