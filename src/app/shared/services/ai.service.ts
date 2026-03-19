// src/app/core/services/ai-api.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AiNlQueryRequest, AiNlQueryResponse } from '../models/ai-nl.types';

@Injectable({ providedIn: 'root' })
export class AiApiService {
  private aiApiUrl = environment.aiApiUrl; 

  constructor(private http: HttpClient) {}

  nlQuery(body: AiNlQueryRequest): Observable<AiNlQueryResponse> {
    const token = localStorage.getItem('token'); // same auth style as the rest
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    // endpoint: /api/ai/nl-query
    return this.http.post<AiNlQueryResponse>(`${this.aiApiUrl}/api/ai/nl-query`, body, { headers });
  }
}
