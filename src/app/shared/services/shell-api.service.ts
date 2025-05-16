import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShellApiService {

  private shellApiUrl = environment.shellApiUrl;

  private shells= [
    {
        "idShell": 1,
        "dateOperation": "2025-05-15",
        "natureOperation": "AVOIR",
        "numeroFacture": "F1000",
        "montant": 1000.0,
        "datePrelevement": "2025-05-16",
        "statut": "EN_ATTENTE",
        "station": "BOUMHAL"
    },
    {
        "idShell": 2,
        "dateOperation": "2025-05-15",
        "natureOperation": "FACTURE_CARBURANT",
        "numeroFacture": "F200",
        "montant": 40000.0,
        "datePrelevement": "2025-05-18",
        "statut": "EN_ATTENTE",
        "station": "ZAHRA"
    },
    {
        "idShell": 3,
        "dateOperation": "2025-05-16",
        "natureOperation": "FACTURE_CARBURANT",
        "numeroFacture": "F50",
        "montant": 2000.0,
        "datePrelevement": "2025-05-19",
        "statut": "EN_ATTENTE",
        "station": "BOUMHAL"
    },
    {
        "idShell": 4,
        "dateOperation": "2025-05-01",
        "natureOperation": "LOYER",
        "numeroFacture": "F400",
        "montant": 5000.0,
        "datePrelevement": "2025-05-31",
        "statut": "EN_ATTENTE",
        "station": "ZAHRA"
    },
    {
        "idShell": 5,
        "dateOperation": "2025-05-11",
        "natureOperation": "FACTURE_CARBURANT",
        "numeroFacture": "F230",
        "montant": 6000.0,
        "datePrelevement": "2025-05-14",
        "statut": "OK",
        "station": "ZAHRA"
    },
    {
        "idShell": 6,
        "dateOperation": "2025-05-20",
        "natureOperation": "AVOIR",
        "numeroFacture": "F1001",
        "montant": 1000.0,
        "datePrelevement": "2025-05-21",
        "statut": "VIDE",
        "station": "BOUMHAL"
    },
    {
        "idShell": 7,
        "dateOperation": "2025-05-20",
        "natureOperation": "FACTURE_LUBRIFIANT",
        "numeroFacture": "F1002",
        "montant": 1000.0,
        "datePrelevement": "2025-06-30",
        "statut": "VIDE",
        "station": "ZAHRA"
    }
];

  constructor(private http: HttpClient) { }

  getAllShell(): Observable<any> {
     return of(this.shells);
  }
    
}
