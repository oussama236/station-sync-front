import { Component, OnInit } from '@angular/core';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit{
  
  data: any;
  loadingSpinner = false;

  constructor(private shellApiService: ShellApiService){}

  ngOnInit(): void {
    this.loadingSpinner = true;
    this.shellApiService.getAllShell().subscribe({
      next: (data) => {
        this.data = data;
      },
      complete: () => {
        this.loadingSpinner = false;
      },
      error: (err) => {
        console.log('error getting data shells', err);
        this.loadingSpinner = false;
      }
    })
  };

  addFacture(){
    this.data = [...this.data, 
      {
        "idShell": 5,
        "dateOperation": "2025-05-11",
        "natureOperation": "FACTURE_CARBURANT",
        "numeroFacture": "F230",
        "montant": 6000.0,
        "datePrelevement": "2025-05-14",
        "statut": "OK",
        "station": "ZAHRA"
    }
    ];
  }
}
