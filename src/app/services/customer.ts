import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../modeles/customer.modle';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = '/api/Customer';
  private http = inject(HttpClient);

  // 1. getAll - להביא את כל הלקוחות
  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  // 2. getByEmail - להביא לקוח מסוים לפי אימייל
  getByEmail(email: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/email/${email}`);
  }

  // 3. add - להוסיף לקוח חדש
  add(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }
}
