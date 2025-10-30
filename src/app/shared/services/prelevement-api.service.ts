import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrelevementApiService {
  private prelevementApiUrl = environment.shellApiUrl;

  constructor(private http: HttpClient) {}

  // Existing
  getAllPrelevements(): Observable<any> {
    return this.http.get(`${this.prelevementApiUrl}/Prelevement/prelevements`);
  }

  addPrelevement(prelevement: any): Observable<any> {
    return this.http.post(`${this.prelevementApiUrl}/Prelevement/addPrelevement`, prelevement);
  }

  simulatePrelevement(montant: number, dateOperation: string): Observable<any> {
    return this.http.post<any>(`${this.prelevementApiUrl}/Prelevement/simulate-auto-assign`, { montant, dateOperation });
  }

  assignShellsManually(prelevementId: number, shellIds: number[]): Observable<any> {
    return this.http.post(`${this.prelevementApiUrl}/Prelevement/manual-assign`, { prelevementId, shellIds });
  }

  getShellsForManualAssign(dateOperation: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.prelevementApiUrl}/Prelevement/manual-shells?dateOperation=${dateOperation}`
    );
  }

  getPrelevementDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.prelevementApiUrl}/Prelevement/${id}`);
  }

  searchPrelevements(date?: string, montant?: number) {
    const params: any = {};
    if (date) params.date = date;
    if (montant !== null && montant !== undefined) params.montant = montant;
    return this.http.get<any[]>(`${this.prelevementApiUrl}/Prelevement/searchPrelevements`, { params });
  }

  // New for edit/delete
  updatePrelevement(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${this.prelevementApiUrl}/Prelevement/update-prelevement/${id}`, body);
  }

  deletePrelevement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.prelevementApiUrl}/Prelevement/remove-prelevement/${id}`);
  }

  autoAssign(id: number): Observable<any> {
    return this.http.post<any>(`${this.prelevementApiUrl}/Prelevement/${id}/auto-assign`, {});
  }
}
