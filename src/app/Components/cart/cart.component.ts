import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PurchasesService } from '../../services/purchases.service';
import { PurchaseResponseDto, PurchaseStatus } from '../../modeles/purchaseResponse.modle';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  private purchaseService = inject(PurchasesService);

  cartItems: PurchaseResponseDto[] = [];
  isLoading: boolean = false;
  isConfirming: boolean = false;

  ngOnInit(): void {
    this.loadCart();
  }

  /**
   * Load cart items (Draft purchases) for the current user
   * Handles $values wrapper if JSON Reference preservation is used
   */
  loadCart(): void {
    this.isLoading = true;
    
    this.purchaseService.getCart().subscribe({
      next: (response: any) => {
        // Handle $values wrapper if present
        if (response && response.$values) {
          this.cartItems = response.$values.filter((item: PurchaseResponseDto) => 
            item.Status === PurchaseStatus.Draft
          );
        } else if (Array.isArray(response)) {
          this.cartItems = response.filter((item: PurchaseResponseDto) => 
            item.Status === PurchaseStatus.Draft
          );
        } else {
          this.cartItems = [];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('שגיאה בטעינת העגלה:', error);
        alert('שגיאה בטעינת העגלה. אנא נסה שנית.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Calculate grand total of all items in cart
   * Uses PascalCase property TotalPrice
   */
  get grandTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.TotalPrice || 0), 0);
  }

  /**
   * Get count of items in cart
   */
  get itemCount(): number {
    return this.cartItems.length;
  }

  /**
   * Get total quantity of all items
   */
  get totalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.Quantity || 0), 0);
  }

  /**
   * Confirm order - approve all draft purchases
   * On success, show message and clear the cart
   */
  confirmOrder(): void {
    if (this.cartItems.length === 0) {
      alert('העגלה ריקה. אין מה לאשר.');
      return;
    }

    const confirmMessage = `האם אתה בטוח שברצונך לאשר הזמנה זו?\n\nסה"כ פריטים: ${this.itemCount}\nסה"כ לתשלום: ₪${this.grandTotal.toFixed(2)}`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.isConfirming = true;

    this.purchaseService.confirmOrder().subscribe({
      next: () => {
        alert('🎉 ההזמנה אושרה בהצלחה!\n\nתודה על הרכישה.');
        this.cartItems = [];
        this.isConfirming = false;
      },
      error: (error) => {
        console.error('שגיאה באישור ההזמנה:', error);
        
        let errorMessage = 'שגיאה באישור ההזמנה. אנא נסה שנית.';
        
        if (error.status === 400) {
          errorMessage = 'נתונים לא תקינים. אנא בדוק את העגלה.';
        } else if (error.status === 401) {
          errorMessage = 'אינך מחובר למערכת. אנא התחבר מחדש.';
        } else if (error.status === 404) {
          errorMessage = 'לא נמצאו פריטים בעגלה.';
        }
        
        alert(errorMessage);
        this.isConfirming = false;
      }
    });
  }

  /**
   * Refresh cart data
   */
  refreshCart(): void {
    this.loadCart();
  }

  /**
   * Check if cart is empty
   */
  get isEmpty(): boolean {
    return this.cartItems.length === 0;
  }
}
