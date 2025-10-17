import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification.model';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class NotificationApiService {

  private baseUrl = `${environment.shellApiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  // notification-api.service.ts
getAllNotifications(): Observable<Notification[]> {
  return this.http.get<Notification[]>(`${this.baseUrl}/dropdown`);
}

  

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`, { params: { status: 'OPEN' } as any });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/read`, {});
  }

  resolveNotification(type: string, refId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${type}/${refId}/resolve`, {});
  }

  refreshNotifications(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/refresh`, {});
  }
}



