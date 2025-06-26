import { ShellApiService } from 'src/app/shared/services/shell-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carburant',
  templateUrl: './carburant.component.html',
  styleUrls: ['./carburant.component.scss']
})
export class CarburantComponent implements OnInit {

  shells: any[] = [];
  loadingSpinner = false;
  selectedStatut: string = 'ALL';
  selectedStation: string = 'ALL';

  constructor(private shellApiService: ShellApiService) {}

  ngOnInit(): void {
    this.fetchCarburant();
  }

  fetchCarburant(): void {
    this.loadingSpinner = true;
  
    const statutParam = this.selectedStatut !== 'ALL' ? this.selectedStatut : null;
    const stationParam = this.selectedStation !== 'ALL' ? this.selectedStation : null;
  
    this.shellApiService.getCarburantByStatutAndStation(statutParam, stationParam).subscribe({
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
    this.fetchCarburant();
  }
}
