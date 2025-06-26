import { ShellApiService } from 'src/app/shared/services/shell-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loyer',
  templateUrl: './loyer.component.html',
  styleUrls: ['./loyer.component.scss']
})
export class LoyerComponent implements OnInit {

  shells: any[] = [];
  loadingSpinner = false;
  selectedStatut: string = 'ALL';
  selectedStation: string = 'ALL';

  constructor(private shellApiService: ShellApiService) {}

  ngOnInit(): void {
    this.fetchLoyer();
  }

  fetchLoyer(): void {
    this.loadingSpinner = true;
  
    const statutParam = this.selectedStatut !== 'ALL' ? this.selectedStatut : null;
    const stationParam = this.selectedStation !== 'ALL' ? this.selectedStation : null;
  
    this.shellApiService.getLoyerByStatutAndStation(statutParam, stationParam).subscribe({
      next: (data: any) => {
        this.shells = data.shells ?? [];
        this.loadingSpinner = false;
      },
      error: () => {
        this.shells = [];
        this.loadingSpinner = false;
      }
    });
  }
  

  onFiltersChanged(filters: { statut: string, station: string }) {
    this.selectedStatut = filters.statut;
    this.selectedStation = filters.station;
    this.fetchLoyer();
  }
}
