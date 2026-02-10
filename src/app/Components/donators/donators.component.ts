import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DonatorService } from '../../services/donator';
import { AuthService } from '../../services/AuthService';
import { Donator } from '../../modeles/donator.model';

@Component({
  selector: 'app-donators',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './donators.component.html',
  styleUrls: ['./donators.component.scss']
})
export class DonatorsComponent implements OnInit {
  private donatorSrv = inject(DonatorService);
  private authService = inject(AuthService);

  donators: Donator[] = [];
  searchText: string = '';
  isEditMode: boolean = false;
  expandedDonatorId: any = null; // משתמש במייל או ID לזיהוי השורה הפתוחה
  editingDonatorEmail: string | undefined = undefined;

  // מודל הטופס - תומך בכל השדות הנדרשים
  currentDonator: any = {
    Name: '',
    Email: '',
    Phone: '',
    Gifts: []
  };

  ngOnInit(): void {
    this.loadDonators();
  }

  /**
   * טעינת כל התורמים מהשרת
   */
  loadDonators(): void {
    this.donatorSrv.getAll().subscribe({
      next: (response: any) => {
        // טיפול במעטפת $values אם קיימת מה-API
        const data = response?.$values || response;
        if (Array.isArray(data)) {
          this.donators = data.map(d => this.normalizeDonator(d));
        } else {
          this.donators = [];
        }
      },
      error: (error) => {
        console.error('Error loading donators:', error);
      }
    });
  }

  /**
   * נרמול נתונים כדי לתמוך גם ב-PascalCase וגם ב-camelCase
   */
  private normalizeDonator(donator: any): Donator {
    return {
      Id: donator.Id || donator.id,
      id: donator.Id || donator.id,
      Name: donator.Name || donator.name || '',
      name: donator.Name || donator.name || '',
      Email: donator.Email || donator.email || '',
      email: donator.Email || donator.email || '',
      Phone: donator.Phone || donator.phone || '',
      Gifts: donator.Gifts || donator.gifts || []
    } as any;
  }

  /**
   * שמירת תורם - הוספה או עדכון לפי מצב העריכה
   */
  saveDonator(): void {
    const dtoToSend = {
      Name: this.currentDonator.Name,
      Email: this.currentDonator.Email,
      Phone: this.currentDonator.Phone || ""
    };

    if (this.isEditMode && this.editingDonatorEmail) {
      // עדכון לפי המייל המקורי (למקרה שהמשתמש שינה את המייל בטופס)
      this.donatorSrv.update(this.editingDonatorEmail, dtoToSend).subscribe({
        next: () => {
          alert('התורם עודכן בהצלחה');
          this.loadDonators();
          this.resetForm();
        },
        error: (err) => alert('שגיאה בעדכון התורם')
      });
    } else {
      // הוספה חדשה
      this.donatorSrv.add(dtoToSend).subscribe({
        next: () => {
          alert('התורם נוסף בהצלחה');
          this.loadDonators();
          this.resetForm();
        },
        error: (err) => alert('שגיאה בהוספת תורם (ייתכן שהמייל כבר קיים)')
      });
    }
  }

  /**
   * הכנת הטופס לעריכה
   */
  startEdit(donator: any): void {
    this.isEditMode = true;
    this.editingDonatorEmail = donator.Email || donator.email;
    
    this.currentDonator = {
      Name: donator.Name || donator.name,
      Email: donator.Email || donator.email,
      Phone: donator.Phone || donator.phone || '',
      Gifts: donator.Gifts || donator.gifts || []
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * מחיקת תורם לפי אימייל
   */
  deleteDonator(donator: any): void {
    const emailToDelete = donator.Email || donator.email;
    if (!emailToDelete) return;

    if (confirm(`האם את בטוחה שברצונך למחוק את ${donator.Name || 'התורם'}?`)) {
      this.donatorSrv.delete(emailToDelete).subscribe({
        next: () => {
          alert('התורם נמחק בהצלחה');
          this.loadDonators();
        },
        error: (err) => {
          const msg = err.status === 500 ? 'לא ניתן למחוק תורם שיש לו מתנות' : 'שגיאה במחיקה';
          alert(msg);
        }
      });
    }
  }

  /**
   * איפוס הטופס
   */
  resetForm(): void {
    this.isEditMode = false;
    this.editingDonatorEmail = undefined;
    this.currentDonator = {
      Name: '',
      Email: '',
      Phone: '',
      Gifts: []
    };
  }

  /**
   * פונקציות עזר עבור ה-Template (מתנות וחיפוש)
   */
  getGifts(donator: any): any[] {
    const gifts = donator.Gifts || donator.gifts || [];
    return gifts.$values || (Array.isArray(gifts) ? gifts : []);
  }

  getGiftCount(donator: any): number {
    return this.getGifts(donator).length;
  }

  toggleGifts(donator: any): void {
    const id = donator.Email || donator.email;
    this.expandedDonatorId = this.expandedDonatorId === id ? null : id;
  }

  isExpanded(donator: any): boolean {
    return this.expandedDonatorId === (donator.Email || donator.email);
  }

get filteredDonators(): Donator[] {
    if (!this.searchText || this.searchText.trim() === '') {
      return this.donators;
    }

    const searchLower = this.searchText.toLowerCase().trim();
    
    return this.donators.filter(donator => {
      // 1. חיפוש בשם התורם
      const nameMatch = (donator.Name || (donator as any).name || '').toLowerCase().includes(searchLower);
      
      // 2. חיפוש באימייל התורם
      const emailMatch = (donator.Email || (donator as any).email || '').toLowerCase().includes(searchLower);
      
      // 3. חיפוש בתוך שמות המתנות של אותו תורם
      const gifts = this.getGifts(donator);
      const giftMatch = gifts.some(gift => 
        (gift.Name || gift.name || '').toLowerCase().includes(searchLower)
      );

      // מחזיר את התורם אם נמצאה התאמה באחד מהשלושה
      return nameMatch || emailMatch || giftMatch;
    });
  }
}