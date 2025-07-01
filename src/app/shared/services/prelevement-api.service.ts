import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PrelevementApiService {

  private prelevementApiUrl = environment.shellApiUrl;
  constructor(private http: HttpClient) {}

  getAllPrelevements(): Observable<any> {
    return this.http.get(`${this.prelevementApiUrl}/Prelevement/prelevements`);  
}

addPrelevement(prelevement: any): Observable<any> {
  return this.http.post(`${this.prelevementApiUrl}/Prelevement/addPrelevement`, prelevement);
}

simulatePrelevement(montant: number, dateOperation: string): Observable<any> {
  return this.http.post<any>(`${this.prelevementApiUrl}/Prelevement/simulate-auto-assign`, {
    montant,
    dateOperation
  });
}
assignShellsManually(prelevementId: number, shellIds: number[]): Observable<any> {
  const payload = {
    prelevementId: prelevementId,
    shellIds: shellIds
  };
  return this.http.post(`${this.prelevementApiUrl}/Prelevement/manual-assign`, payload);
}

getShellsForManualAssign(dateOperation: string): Observable<any[]> {
  return this.http.get<any[]>( `${this.prelevementApiUrl}/Prelevement/manual-shells?dateOperation=${dateOperation}`
  );
}

getPrelevementDetails(id: number): Observable<any> {
  return this.http.get<any>(`${this.prelevementApiUrl}/Prelevement/${id}`);
}

searchPrelevements(date?: string, montant?: number) {
  let params: any = {};

  if (date) params.date = date;
  if (montant !== null && montant !== undefined) params.montant = montant;

  return this.http.get<any[]>(`${this.prelevementApiUrl}/Prelevement/searchPrelevements`, { params });
}

}
