import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DonatorService {
  private apiUrl = 'https://localhost:7239/api/Donators'; 
  private http = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  add(donator: any): Observable<any> {
    // שליחת האובייקט כפי שהוא, השרת יטפל ב-ID החדש
    return this.http.post<any>(this.apiUrl, donator);
  }

  // donator.service.ts

// מחיקה לפי אימייל
delete(email: string): Observable<void> {
  // מקודם זה היה כנראה ${this.apiUrl}/${id}
  return this.http.delete<void>(`${this.apiUrl}/${email}`);
}

// גם ה-Update צריך לקבל אימייל ב-URL
update(email: string, donator: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${email}`, donator);
}
}