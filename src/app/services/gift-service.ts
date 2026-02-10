import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { giftModel } from '../modeles/giftListModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private apiUrl = 'https://localhost:7239/api/Gifts';
  private http = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  add(gift: giftModel): Observable<giftModel> {
    return this.http.post<giftModel>(this.apiUrl, gift);
  }

  // התיקון כאן:
  update(gift: any): Observable<any> {
    // 1. חילוץ ה-ID בצורה בטוחה
    const id = gift.Id || gift.id; 
    
    // 2. בדיקת הגנה - אם אין ID, אל תשלח בקשה בכלל
    if (!id) {
      console.error('GiftService: Cannot update without an ID!', gift);
      throw new Error('Missing ID for update');
    }

    // 3. יצירת האובייקט המדויק שהשרת מצפה לו (PascalCase)
    // זה מוודא שאנחנו לא שולחים שדות מיותרים שעלולים לבלבל את ה-Routing
    const payload = {
      Id: id,
      Name: gift.Name || gift.name,
      Price: gift.Price || gift.price,
      Category: gift.Category || gift.category,
      DonatorId: gift.DonatorId || gift.donatorId,
      DonatorName: gift.DonatorName || ""
    };

    console.log(`Sending PUT request to: ${this.apiUrl}/${id}`, payload);
    
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

remove(id: any): Observable<void> {
  // אם במקרה נשלח אובייקט במקום מספר, נחלץ את ה-ID
  const finalId = (typeof id === 'object') ? (id.Id || id.id) : id;

  if (!finalId || finalId === 'undefined') {
    console.error('GiftService: Cannot delete without a valid ID!', id);
    throw new Error('Missing ID for delete');
  }

  console.log(`Sending DELETE request to: ${this.apiUrl}/${finalId}`);
  return this.http.delete<void>(`${this.apiUrl}/${finalId}`);
}

/**
 * Draw a winner for a specific gift
 * @param giftId The ID of the gift to draw a winner for
 * @returns Observable with winner information
 */
drawWinner(giftId: number): Observable<any> {
  console.log(`🎲 Drawing winner for gift ID: ${giftId}`);
  return this.http.post<any>(`${this.apiUrl}/draw/${giftId}`, {});
}
}