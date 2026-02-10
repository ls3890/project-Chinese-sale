import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { giftModel } from '../../modeles/giftListModel';
import { GiftService } from '../../services/gift-service';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gifts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gifts.html',
  styleUrls: ['./gifts.scss'],
})
export class Gifts implements OnInit {
  public authService = inject(AuthService);
  private giftSrv = inject(GiftService);
  private router = inject(Router);

  allGifts: giftModel[] = [];
  isLoading: boolean = false;
  isEditMode: boolean = false;
  editingGiftId: number | null = null;

  // החזרת כל הפילטרים המקוריים
  filterName: string = '';
  filterDonator: string = '';
  filterPurchasers: number | null = null;

  newGift: giftModel = { 
    name: '', price: 0, category: '', donatorId: 1, numOfCostermes: 0 
  };

  ngOnInit(): void {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadGifts();
  }

  loadGifts() {
    this.isLoading = true;
    this.giftSrv.getAll().subscribe({
      next: (data: any) => {
        this.allGifts = data.$values || data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load error', err);
        this.isLoading = false;
      }
    });
  }

  saveGift() {
    if (this.isEditMode) {
      this.updateGift();
    } else {
      this.addGift();
    }
  }

  addGift() {
    const giftToSend = this.prepareData();
    this.giftSrv.add(giftToSend as any).subscribe({
      next: () => {
        alert('המתנה נוספה בהצלחה! 🎉');
        this.loadGifts(); 
        this.resetForm();
      },
      error: (err) => this.handleError(err)
    });
  }

  updateGift() {
  if (!this.editingGiftId) {
    console.error('Error: editingGiftId is undefined!');
    alert('שגיאה: לא נמצא מזהה לעדכון המתנה');
    return;
  }

  const giftToSend = { 
    ...this.prepareData(), 
    Id: this.editingGiftId // ודאי שכאן ה-I גדולה כדי להתאים ל-C#
  };

  console.log('שולח עדכון לשרת עבור ID:', this.editingGiftId);
  
  this.giftSrv.update(giftToSend as any).subscribe({
    next: () => {
      alert('המתנה עודכנה בהצלחה!');
      this.loadGifts();
      this.cancelEdit();
    },
    error: (err) => {
      console.error('Update Request Failed:', err);
      this.handleError(err);
    }
  });
}

  deleteGift(gift: any) {
    // חילוץ בטוח של ה-ID כדי למנוע את ה-undefined שראינו בתמונה
    const id = gift.id || gift.Id || (gift as any).ID;
    
    if (!id) {
      alert('שגיאה: לא נמצא מזהה למחיקה');
      return;
    }

    if (confirm('בטוח שברצונך למחוק מתנה זו?')) {
      this.giftSrv.remove(id).subscribe({
        next: () => {
          alert('המתנה נמחקה');
          this.loadGifts();
        },
        error: (err) => alert('המחיקה נכשלה')
      });
    }
  }

 startEdit(gift: any) {
  this.isEditMode = true;
  
  // התיקון: חילוץ אגרסיבי של ה-ID. נסי את כל האופציות:
  this.editingGiftId = gift.id || gift.Id || gift.ID || (gift as any).id;
  
  console.log('מזהה שנבחר לעריכה:', this.editingGiftId); // בדקי ב-Console שזה לא undefined

  this.newGift = { 
    name: gift.name || gift.Name, 
    price: gift.price || gift.Price, 
    category: gift.category || gift.Category, 
    donatorId: gift.donatorId || gift.DonatorId,
    numOfCostermes: gift.numOfCostermes || gift.NumOfCostermes || 0
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  cancelEdit() {
    this.isEditMode = false;
    this.editingGiftId = null;
    this.resetForm();
  }

  private prepareData() {
    return {
      Name: this.newGift.name,
      Price: Number(this.newGift.price),
      Category: this.newGift.category,
      DonatorId: Number(this.newGift.donatorId),
      DonatorName: "" // התיקון שסידר את ההוספה
    };
  }

  resetForm() {
    this.newGift = { name: '', price: 0, category: '', donatorId: 1, numOfCostermes: 0 };
  }

  handleError(err: HttpErrorResponse) {
    console.error('Server error:', err);
    alert('שגיאת נתונים מהשרת - בדקי את ה-Console');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // פונקציית הסינון המלאה
  get filteredGifts() {
    return this.allGifts.filter(gift => {
      const g = gift as any;
      const name = (g.name || g.Name || '').toLowerCase();
      const donator = (g.donatorName || g.DonatorName || '').toLowerCase();
      const count = g.numOfCostermes || g.NumOfCostermes || 0;

      const matchName = name.includes(this.filterName.toLowerCase());
      const matchDonator = donator.includes(this.filterDonator.toLowerCase());
      const matchPurchasers = !this.filterPurchasers || count >= this.filterPurchasers;

      return matchName && matchDonator && matchPurchasers;
    });
  }

  /**
   * Sort gifts by different criteria
   */
  sortGifts(criteria: string): void {
    if (!criteria) {
      return;
    }

    switch (criteria) {
      case 'price-high':
        this.allGifts.sort((a, b) => {
          const priceA = (a as any).price || (a as any).Price || 0;
          const priceB = (b as any).price || (b as any).Price || 0;
          return priceB - priceA;
        });
        break;

      case 'price-low':
        this.allGifts.sort((a, b) => {
          const priceA = (a as any).price || (a as any).Price || 0;
          const priceB = (b as any).price || (b as any).Price || 0;
          return priceA - priceB;
        });
        break;

      case 'popular':
        this.allGifts.sort((a, b) => {
          const countA = (a as any).numOfCostermes || (a as any).NumOfCostermes || 0;
          const countB = (b as any).numOfCostermes || (b as any).NumOfCostermes || 0;
          return countB - countA;
        });
        break;

      case 'name':
        this.allGifts.sort((a, b) => {
          const nameA = ((a as any).name || (a as any).Name || '').toLowerCase();
          const nameB = ((b as any).name || (b as any).Name || '').toLowerCase();
          return nameA.localeCompare(nameB, 'he');
        });
        break;
    }

    console.log('🔄 Sorted gifts by:', criteria);
  }
}