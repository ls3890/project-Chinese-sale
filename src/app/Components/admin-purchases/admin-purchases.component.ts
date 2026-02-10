import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PurchasesService } from '../../services/purchases.service';
import { GiftService } from '../../services/gift-service';
import { PurchaseResponseDto, PurchaseStatus } from '../../modeles/purchaseResponse.modle';

interface GiftSalesInfo {
  giftId: number;
  giftName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  unitPrice: number;
  purchaseCount: number;
  isDrawing?: boolean;
  hasWinner?: boolean;
}

interface PurchaserDetail {
  purchaseId: number;
  giftId: number;
  giftName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

type SortBy = 'price' | 'popularity' | 'name';

@Component({
  selector: 'app-admin-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-purchases.component.html',
  styleUrls: ['./admin-purchases.component.scss']
})
export class AdminPurchasesComponent implements OnInit {
  private purchaseService = inject(PurchasesService);
  private giftService = inject(GiftService);

  approvedPurchases: PurchaseResponseDto[] = [];
  giftsSalesInfo: GiftSalesInfo[] = [];
  purchaserDetails: PurchaserDetail[] = [];
  
  isLoading: boolean = false;
  currentSort: SortBy = 'popularity';
  searchText: string = '';
  selectedGiftId: number | null = null;

  // Raffle/Winner properties
  showWinnerModal: boolean = false;
  winnerInfo: any = null;
  currentDrawingGiftId: number | null = null;

  ngOnInit(): void {
    this.loadApprovedPurchases();
  }

  /**
   * Load all approved purchases from the server
   * Handles $values wrapper if JSON Reference preservation is used
   */
  loadApprovedPurchases(): void {
    this.isLoading = true;
    console.log('📊 Loading approved purchases...');
    
    this.purchaseService.getAllApproved().subscribe({
      next: (response: any) => {
        console.log('✅ Received approved purchases:', response);
        
        // Handle $values wrapper if present
        if (response && response.$values) {
          this.approvedPurchases = response.$values.filter((item: PurchaseResponseDto) => 
            item.Status === PurchaseStatus.Approved
          );
        } else if (Array.isArray(response)) {
          this.approvedPurchases = response.filter((item: PurchaseResponseDto) => 
            item.Status === PurchaseStatus.Approved
          );
        } else {
          this.approvedPurchases = [];
        }
        
        console.log('📦 Filtered approved purchases:', this.approvedPurchases.length);
        
        this.processGiftsSales();
        this.processPurchaserDetails();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ שגיאה בטעינת רכישות מאושרות:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        
        let errorMessage = 'שגיאה בטעינת הנתונים. אנא נסה שנית.';
        
        if (error.status === 401) {
          errorMessage = 'אין הרשאה. אנא התחבר מחדש כמנהל.';
        } else if (error.status === 403) {
          errorMessage = 'אין לך הרשאה לצפות בדף זה. נדרש תפקיד מנהל.';
        }
        
        alert(errorMessage);
        this.isLoading = false;
      }
    });
  }

  /**
   * Process approved purchases to create gifts sales information
   * Groups by GiftId and calculates totals
   */
  private processGiftsSales(): void {
    const giftsMap = new Map<number, GiftSalesInfo>();

    this.approvedPurchases.forEach(purchase => {
      const giftId = purchase.GiftId;
      
      if (giftsMap.has(giftId)) {
        const existing = giftsMap.get(giftId)!;
        existing.totalQuantitySold += purchase.Quantity;
        existing.totalRevenue += purchase.TotalPrice;
        existing.purchaseCount += 1;
      } else {
        giftsMap.set(giftId, {
          giftId: giftId,
          giftName: purchase.GiftName,
          totalQuantitySold: purchase.Quantity,
          totalRevenue: purchase.TotalPrice,
          unitPrice: purchase.UnitPrice,
          purchaseCount: 1
        });
      }
    });

    this.giftsSalesInfo = Array.from(giftsMap.values());
    this.sortGifts(this.currentSort);
  }

  /**
   * Process purchaser details for display
   */
  private processPurchaserDetails(): void {
    this.purchaserDetails = this.approvedPurchases.map(purchase => ({
      purchaseId: purchase.Id,
      giftId: purchase.GiftId,
      giftName: purchase.GiftName,
      quantity: purchase.Quantity,
      unitPrice: purchase.UnitPrice,
      totalPrice: purchase.TotalPrice
    }));
  }

  /**
   * Sort gifts by the specified criteria
   * @param sortBy - 'price' (most expensive first), 'popularity' (most sold), or 'name'
   */
  sortGifts(sortBy: SortBy): void {
    this.currentSort = sortBy;

    switch (sortBy) {
      case 'price':
        // Sort by price - most expensive first
        this.giftsSalesInfo.sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      
      case 'popularity':
        // Sort by total quantity sold - most popular first
        this.giftsSalesInfo.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);
        break;
      
      case 'name':
        // Sort alphabetically by gift name
        this.giftsSalesInfo.sort((a, b) => a.giftName.localeCompare(b.giftName, 'he'));
        break;
    }
  }

  /**
   * Get filtered gifts based on search text
   */
  get filteredGifts(): GiftSalesInfo[] {
    if (!this.searchText || this.searchText.trim() === '') {
      return this.giftsSalesInfo;
    }

    const searchLower = this.searchText.toLowerCase().trim();
    
    return this.giftsSalesInfo.filter(gift => 
      gift.giftName.toLowerCase().includes(searchLower) ||
      gift.giftId.toString().includes(searchLower)
    );
  }

  /**
   * Get filtered purchaser details based on search and selected gift
   */
  get filteredPurchaserDetails(): PurchaserDetail[] {
    let filtered = this.purchaserDetails;

    // Filter by selected gift
    if (this.selectedGiftId !== null) {
      filtered = filtered.filter(detail => detail.giftId === this.selectedGiftId);
    }

    // Filter by search text
    if (this.searchText && this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(detail => 
        detail.giftName.toLowerCase().includes(searchLower) ||
        detail.giftId.toString().includes(searchLower)
      );
    }

    return filtered;
  }

  /**
   * Select a gift to view its purchaser details
   */
  selectGift(giftId: number | null): void {
    this.selectedGiftId = giftId;
  }

  /**
   * Check if a gift is selected
   */
  isGiftSelected(giftId: number): boolean {
    return this.selectedGiftId === giftId;
  }

  /**
   * Calculate total revenue from all approved purchases
   */
  get totalRevenue(): number {
    return this.giftsSalesInfo.reduce((sum, gift) => sum + gift.totalRevenue, 0);
  }

  /**
   * Calculate total quantity sold across all gifts
   */
  get totalQuantitySold(): number {
    return this.giftsSalesInfo.reduce((sum, gift) => sum + gift.totalQuantitySold, 0);
  }

  /**
   * Get total number of unique gifts sold
   */
  get totalGiftsSold(): number {
    return this.giftsSalesInfo.length;
  }

  /**
   * Get total number of purchases
   */
  get totalPurchases(): number {
    return this.approvedPurchases.length;
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.selectedGiftId = null;
    this.loadApprovedPurchases();
  }

  /**
   * Get sort indicator for UI
   */
  getSortIndicator(sortType: SortBy): string {
    if (this.currentSort === sortType) {
      return '▼';
    }
    return '';
  }

  /**
   * Get total quantity from filtered purchaser details
   */
  get filteredTotalQuantity(): number {
    return this.filteredPurchaserDetails.reduce((sum, d) => sum + d.quantity, 0);
  }

  /**
   * Get total price from filtered purchaser details
   */
  get filteredTotalPrice(): number {
    return this.filteredPurchaserDetails.reduce((sum, d) => sum + d.totalPrice, 0);
  }

  /**
   * Run raffle/draw winner for a gift
   */
  runRaffle(gift: GiftSalesInfo): void {
    if (gift.hasWinner || gift.isDrawing) {
      return;
    }

    if (gift.purchaseCount === 0) {
      alert('אין משתתפים בהגרלה עבור מתנה זו');
      return;
    }

    // Set drawing state
    gift.isDrawing = true;
    this.currentDrawingGiftId = gift.giftId;

    console.log('🎲 Starting raffle for gift:', gift.giftName);

    this.giftService.drawWinner(gift.giftId).subscribe({
      next: (winner: any) => {
        console.log('🎉 Winner drawn:', winner);
        
        gift.isDrawing = false;
        gift.hasWinner = true;
        this.currentDrawingGiftId = null;

        // Extract winner info (handle both PascalCase and camelCase)
        this.winnerInfo = {
          giftName: gift.giftName,
          winnerName: winner.WinnerName || winner.winnerName || winner.Name || winner.name,
          winnerEmail: winner.WinnerEmail || winner.winnerEmail || winner.Email || winner.email,
          purchaseId: winner.PurchaseId || winner.purchaseId || winner.Id || winner.id
        };

        this.showWinnerModal = true;
        
        // Show confetti effect
        this.showConfetti();
      },
      error: (error) => {
        console.error('❌ Error drawing winner:', error);
        gift.isDrawing = false;
        this.currentDrawingGiftId = null;

        let errorMessage = 'שגיאה בהגרלה. אנא נסה שנית.';
        
        if (error.status === 400) {
          errorMessage = 'לא ניתן לבצע הגרלה - אין משתתפים או שהיא כבר בוצעה.';
        } else if (error.status === 404) {
          errorMessage = 'המתנה לא נמצאה.';
        }

        alert(errorMessage);
      }
    });
  }

  /**
   * Close winner modal
   */
  closeWinnerModal(): void {
    this.showWinnerModal = false;
    this.winnerInfo = null;
  }

  /**
   * Show confetti animation (simple CSS-based confetti)
   */
  showConfetti(): void {
    // Create confetti elements
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      document.body.appendChild(confetti);

      // Remove after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          document.body.removeChild(confetti);
        }
      }, 4000);
    }
  }
}
