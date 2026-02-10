import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GiftService } from '../../services/gift-service';
import { PurchasesService } from '../../services/purchases.service';
import { AuthService } from '../../services/AuthService';
import { giftModel } from '../../modeles/gift.model';
import { PurchaseDto } from '../../modeles/purchases.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private giftService = inject(GiftService);
  private purchaseService = inject(PurchasesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  gifts: giftModel[] = [];
  filteredGifts: giftModel[] = [];
  categories: string[] = [];
  
  searchText: string = '';
  selectedCategory: string = 'all';
  isLoading: boolean = false;
  cartItemCount: number = 0;

  ngOnInit(): void {
    this.loadGifts();
    this.loadCartCount();
  }

  /**
   * Load all gifts from the server
   */
  loadGifts(): void {
    this.isLoading = true;
    
    this.giftService.getAll().subscribe({
      next: (response: any) => {
        // Handle $values wrapper if present
        if (response && response.$values) {
          this.gifts = response.$values;
        } else if (Array.isArray(response)) {
          this.gifts = response;
        } else {
          this.gifts = [];
        }
        
        this.filteredGifts = [...this.gifts];
        this.extractCategories();
        this.isLoading = false;
        
        console.log('🎁 Loaded gifts:', this.gifts.length);
      },
      error: (error) => {
        console.error('Error loading gifts:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Extract unique categories from gifts
   */
  extractCategories(): void {
    const categorySet = new Set<string>();
    this.gifts.forEach(gift => {
      const category = gift.category || gift.Category || gift.categoryName || gift.CategoryName;
      if (category) {
        categorySet.add(category);
      }
    });
    this.categories = Array.from(categorySet);
  }

  /**
   * Filter gifts based on search text and category
   */
  filterGifts(): void {
    this.filteredGifts = this.gifts.filter(gift => {
      const giftName = (gift.name || gift.Name || '').toLowerCase();
      const giftCategory = (gift.category || gift.Category || gift.categoryName || gift.CategoryName || '').toLowerCase();
      const searchLower = this.searchText.toLowerCase();
      
      const matchesSearch = !this.searchText || 
        giftName.includes(searchLower) ||
        giftCategory.includes(searchLower);
      
      const actualCategory = gift.category || gift.Category || gift.categoryName || gift.CategoryName;
      const matchesCategory = this.selectedCategory === 'all' || 
        actualCategory === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }
  /**
   * Add gift to cart
   */
  addToCart(gift: giftModel): void {
    if (!this.isLoggedIn) {
      alert('יש להתחבר כדי להוסיף פריטים לעגלה');
      this.router.navigate(['/login']);
      return;
    }

    const giftId = gift.id || gift.Id || 0;
    const unitPrice = gift.price || gift.Price || gift.ticketCost || gift.TicketCost || 0;
    const giftName = gift.name || gift.Name || 'מתנה';

    const purchase: PurchaseDto = {
      GiftId: giftId,
      Quantity: 1,
      UnitPrice: unitPrice
    };

    console.log('🛒 Adding to cart:', purchase);

    this.purchaseService.addToCart(purchase).subscribe({
      next: () => {
        this.showSuccessMessage(`${giftName} נוסף לעגלה בהצלחה! 🎉`);
        this.cartItemCount++;
      },
      error: (error) => {
        console.error('❌ Error adding to cart:', error);
        if (error.status === 500) {
          alert('שגיאת שרת 500. בדוק שהשרת פועל ושהנתונים תקינים.');
        } else {
          alert('שגיאה בהוספה לעגלה. אנא נסה שנית.');
        }
      }
    });
  }

  /**
   * Load cart item count
   */
  loadCartCount(): void {
    if (!this.isLoggedIn) {
      this.cartItemCount = 0;
      return;
    }

    this.purchaseService.getCart().subscribe({
      next: (response: any) => {
        if (response && response.$values) {
          this.cartItemCount = response.$values.length;
        } else if (Array.isArray(response)) {
          this.cartItemCount = response.length;
        }
      },
      error: (error) => {
        console.error('Error loading cart count:', error);
      }
    });
  }

  /**
   * Show success message (toast notification)
   */
  showSuccessMessage(message: string): void {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `<span class="toast-icon">✓</span><span class="toast-message">${message}</span>`;
    document.body.appendChild(toast);

    console.log('✅ Toast notification created:', message);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 400);
    }, 3000);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.cartItemCount = 0;
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is logged in
   */
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  /**
   * Get current user name
   */
  get userName(): string | null {
    return this.authService.getUserName();
  }

  /**
   * Check if current user is manager
   */
  get isManager(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Get display price in shekels
   */
  getDisplayPrice(gift: giftModel): string {
    const price = gift.price || gift.Price || gift.ticketCost || gift.TicketCost || 0;
    return `₪${price.toFixed(2)}`;
  }

  /**
   * Get gift image URL
   */
  getGiftImage(gift: giftModel): string {
    // Use actual image if available from API
    const imageUrl = gift.image || gift.Image || gift.imageUrl || gift.ImageUrl;
    if (imageUrl) {
      return imageUrl;
    }
    
    // Fallback to placeholder with unique seed
    const seed = gift.name || gift.Name || 'gift';
    return `https://picsum.photos/seed/${seed}/400/300`;
  }

  /**
   * Get gift name
   */
  getGiftName(gift: giftModel): string {
    return gift.name || gift.Name || 'מתנה';
  }

  /**
   * Get gift category
   */
  getGiftCategory(gift: giftModel): string | undefined {
    return gift.category || gift.Category || gift.categoryName || gift.CategoryName;
  }

  /**
   * Get donor name
   */
  getDonorName(gift: giftModel): string | undefined {
    return gift.donatorName || gift.DonatorName || gift.donor || gift.Donor;
  }

  /**
   * Get number of participants
   */
  getParticipantCount(gift: giftModel): number | undefined {
    return gift.numOfCostermes || gift.NumOfCostermes;
  }

  /**
   * Sort gifts by different criteria
   */
  sortGifts(criteria: string): void {
    if (!criteria) {
      // Reset to original order
      this.filteredGifts = [...this.gifts];
      this.filterGifts();
      return;
    }

    switch (criteria) {
      case 'expensive':
        this.filteredGifts.sort((a, b) => {
          const priceA = a.ticketCost || a.TicketCost || a.price || a.Price || 0;
          const priceB = b.ticketCost || b.TicketCost || b.price || b.Price || 0;
          return priceB - priceA; // Descending order (most expensive first)
        });
        break;
        
      case 'popular':
        this.filteredGifts.sort((a, b) => {
          const countA = a.purchaseCount || a.PurchaseCount || a.numOfCostermes || a.NumOfCostermes || 0;
          const countB = b.purchaseCount || b.PurchaseCount || b.numOfCostermes || b.NumOfCostermes || 0;
          return countB - countA; // Descending order (most popular first)
        });
        break;
        
      case 'name':
        this.filteredGifts.sort((a, b) => {
          const nameA = (a.name || a.Name || '').toLowerCase();
          const nameB = (b.name || b.Name || '').toLowerCase();
          return nameA.localeCompare(nameB, 'he'); // Alphabetical order with Hebrew support
        });
        break;
    }
    
    console.log('🔄 Sorted gifts by:', criteria);
  }
}
