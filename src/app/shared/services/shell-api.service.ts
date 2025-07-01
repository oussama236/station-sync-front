import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShellSearchCriteria } from '../models/shell-search-criteria';


@Injectable({
  providedIn: 'root'
})
export class ShellApiService {

  private shellApiUrl = environment.shellApiUrl;

  constructor(private http: HttpClient) {}

  getAllShell(): Observable<any> {
    return this.http.get(`${this.shellApiUrl}/Shell/shells`);
  }

  addShell(shell: any): Observable<any> {
    return this.http.post(`${this.shellApiUrl}/Shell/addshell`, shell);
  }

  getFilteredShells(statut: string | null, station: string | null): Observable<any> {
    let params: any = {};
  
    if (statut) params.statut = statut;
    if (station) params.station = station;
  
    return this.http.get(`${this.shellApiUrl}/Shell/shells/filter`, { params });
  }
  getAvoirsByStatutAndStation(statut: string | null, station: string | null): Observable<any> {
    let url = `${this.shellApiUrl}/Shell/shells/filter?category=AVOIR`;
  
    if (statut) url += `&statut=${statut}`;
    if (station) url += `&station=${station}`;
  
    return this.http.get<any>(url);
  }

  getCarburantByStatutAndStation(statut: string | null, station: string | null): Observable<any> {
    let url = `${this.shellApiUrl}/Shell/shells/filter?category=FACTURE_CARBURANT`;
  
    if (statut) url += `&statut=${statut}`;
    if (station) url += `&station=${station}`;
  
    return this.http.get<any>(url);
  }

  getLubrifiantByStatutAndStation(statut: string | null, station: string | null): Observable<any> {
    let url = `${this.shellApiUrl}/Shell/shells/filter?category=FACTURE_LUBRIFIANT`;
  
    if (statut) url += `&statut=${statut}`;
    if (station) url += `&station=${station}`;
  
    return this.http.get<any>(url);
  }

  getLoyerByStatutAndStation(statut: string | null, station: string | null): Observable<any> {
    let url = `${this.shellApiUrl}/Shell/shells/filter?category=LOYER`;
  
    if (statut) url += `&statut=${statut}`;
    if (station) url += `&station=${station}`;
  
    return this.http.get<any>(url);
  }

  deleteFacture(id: number): Observable<any> {
    return this.http.delete(`${this.shellApiUrl}/Shell/remove-shell/${id}`);
  }

  updateShell(id: number, updatedFacture: any) {
    return this.http.put(`${this.shellApiUrl}/Shell/update-shell/${id}`, updatedFacture);
  }

  updateStatuts(): Observable<any> {
    return this.http.put(`${this.shellApiUrl}/Shell/update-statuts`, null); // ✅ backticks ici
  }
  
  
  searchShells(criteria: ShellSearchCriteria): Observable<any> {
    return this.http.post(`${this.shellApiUrl}/Shell/advanced-search`, criteria);
  }

  getMonthlyStats(nature?: string): Observable<any[]> {
    let url = `${this.shellApiUrl}/Shell/monthly-stats`;
    if (nature) {
      url += `?nature=${nature}`;
    }
    return this.http.get<any[]>(url);
  }
  
}