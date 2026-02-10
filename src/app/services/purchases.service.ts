import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseDto, UpdateCartDto } from '../modeles/purchases.model';
import { PurchaseResponseDto, PurchaseStatus } from '../modeles/purchaseResponse.modle';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private baseUrl = 'https://localhost:7239';
  private apiUrl = `${this.baseUrl}/api/purchases`;
  private adminApiUrl = `${this.baseUrl}/api/admin/purchases`;
  private http = inject(HttpClient);

  // Customer endpoints
  
  // Get cart items (Draft purchases) for current user
  getCart(): Observable<PurchaseResponseDto[]> {
    return this.http.get<PurchaseResponseDto[]>(`${this.apiUrl}/cart`);
  }

  // Add item to cart
  addToCart(purchase: PurchaseDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, purchase);
  }

  // Confirm order (approve all Draft purchases)
  confirmOrder(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/confirm`, {});
  }

  // Admin endpoints

  // Get all approved purchases
  getAllApproved(): Observable<PurchaseResponseDto[]> {
    return this.http.get<PurchaseResponseDto[]>(this.adminApiUrl);
  }

  // Get purchases by gift ID
  getByGift(giftId: number): Observable<PurchaseResponseDto[]> {
    return this.http.get<PurchaseResponseDto[]>(`${this.adminApiUrl}/by-gift/${giftId}`);
  }

  // Legacy methods (keeping for backward compatibility)

  getAll(): Observable<PurchaseResponseDto[]> {
    return this.http.get<PurchaseResponseDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<PurchaseResponseDto> {
    return this.http.get<PurchaseResponseDto>(`${this.apiUrl}/${id}`);
  }

  getByStatus(status: PurchaseStatus): Observable<PurchaseResponseDto[]> {
    return this.http.get<PurchaseResponseDto[]>(`${this.apiUrl}/status/${status}`);
  }

  update(id: number, updateCart: UpdateCartDto): Observable<PurchaseResponseDto> {
    return this.http.put<PurchaseResponseDto>(`${this.apiUrl}/${id}`, updateCart);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: PurchaseStatus): Observable<PurchaseResponseDto> {
    return this.http.patch<PurchaseResponseDto>(`${this.apiUrl}/${id}/status`, { status });
  }
}
