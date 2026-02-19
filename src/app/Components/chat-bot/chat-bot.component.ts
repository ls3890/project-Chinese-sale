import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GiftService } from '../../services/gift-service';
import { AuthService } from '../../services/AuthService';
import { PurchasesService } from '../../services/purchases.service';
import { giftModel } from '../../modeles/gift.model';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {
  // Service injection using inject()
  private giftService = inject(GiftService);
  private authService = inject(AuthService);
  private purchasesService = inject(PurchasesService);

  // Using signals for reactive state
  isChatOpen = signal(false);
  isMinimized = signal(false);
  messages = signal<Message[]>([]);
  userInput = signal('');
  isTyping = signal(false);
  giftsCount = signal<number>(0);
  userName = signal<string>('');
  cartItemsCount = signal<number>(0);
  giftsData = signal<giftModel[]>([]);
  showQuickActions = signal(true);

  // Computed signal for welcome message
  welcomeMessage = computed(() => {
    const name = this.userName();
    if (name) {
      return `שלום ${name}! אני עוזר המכירה הפומבית המתקדם. איך אוכל לעזור לך היום? 🤖`;
    }
    return 'שלום! אני עוזר המכירה הפומבית המתקדם. איך אוכל לעזור לך היום? 🤖';
  });

  ngOnInit(): void {
    // Load user name from AuthService
    const name = this.authService.getUserName();
    if (name) {
      this.userName.set(name);
    }

    // Load gifts data
    this.loadGiftsData();
    
    // Load cart items count
    this.loadCartCount();
  }

  private loadGiftsData(): void {
    this.giftService.getAll().subscribe({
      next: (response) => {
        console.log('✅ צ\'אטבוט: מתנות נטענו בהצלחה:', response);
        console.log('🔍 סוג הנתונים:', typeof response, 'האם מערך?', Array.isArray(response));
        
        // Handle different response formats
        let gifts: any[] = [];
        
        if (Array.isArray(response)) {
          console.log('✓ התגובה היא מערך ישיר');
          gifts = response;
        } else if (response && typeof response === 'object') {
          console.log('🔍 התגובה היא אובייקט, מחפש property מתאים...');
          const resp = response as any;
          
          // Log structure for debugging
          const keys = Object.keys(resp);
          console.log('🔑 מפתחות באובייקט:', keys);
          console.log('📊 JSON מלא:', JSON.stringify(response, null, 2));
          
          // Try all possible property names
          gifts = resp.data || resp.Data || resp.items || resp.Items || 
                  resp.gifts || resp.Gifts || resp.value || resp.Value || 
                  resp.result || resp.Result || resp.list || resp.List ||
                  resp.records || resp.Records || [];
          
          console.log('🎯 נמצא property?', Array.isArray(gifts) ? `כן, אורך: ${gifts.length}` : 'לא');
          
          // If still not found, try to get the first array we find
          if (!Array.isArray(gifts) || gifts.length === 0) {
            console.log('🔧 מחפש מערך בכל ה-properties...');
            
            for (const key of keys) {
              if (Array.isArray(resp[key])) {
                console.log(`✓ מצאתי מערך ב-property: "${key}", אורך: ${resp[key].length}`);
                gifts = resp[key];
                break;
              }
            }
            
            // Last resort: try Object.values
            if (!Array.isArray(gifts) || gifts.length === 0) {
              const values = Object.values(response);
              console.log('🔧 מנסה Object.values, מצאתי:', values.length, 'values');
              
              for (let i = 0; i < values.length; i++) {
                if (Array.isArray(values[i]) && (values[i] as any[]).length > 0) {
                  console.log(`✓ מצאתי מערך ב-values[${i}], אורך: ${(values[i] as any[]).length}`);
                  gifts = values[i] as any[];
                  break;
                }
              }
            }
          }
        }
        
        console.log('📦 מתנות שחולצו סופית:', gifts.length);
        if (gifts.length > 0) {
          console.log('📋 דוגמה למתנה ראשונה:', gifts[0]);
        }
        
        if (Array.isArray(gifts) && gifts.length > 0) {
          this.giftsData.set(gifts);
          this.giftsCount.set(gifts.length);
          console.log('✅✅✅ הצלחה! סה"כ מתנות נשמרו:', gifts.length);
        } else {
          console.error('❌ לא נמצאו מתנות במערך!');
          console.error('💡 אנא העתק את השורה "📊 JSON מלא" מהקונסול ושלח למפתח');
          this.giftsData.set([]);
          this.giftsCount.set(0);
        }
      },
      error: (err) => {
        console.error('❌ שגיאה בטעינת מתנות בצ\'אטבוט:', err);
        this.giftsCount.set(0);
      }
    });
  }

  private loadCartCount(): void {
    // Only load cart if user is authenticated
    if (!this.authService.isAuthenticated) {
      console.log('⚠️ משתמש לא מחובר, לא טוען עגלה');
      this.cartItemsCount.set(0);
      return;
    }

    this.purchasesService.getCart().subscribe({
      next: (response) => {
        console.log('✅ צ\'אטבוט: עגלה נטענה:', response);
        console.log('🔍 סוג נתוני עגלה:', typeof response, 'האם מערך?', Array.isArray(response));
        
        // Handle different response formats
        let cartItems: any[] = [];
        
        if (Array.isArray(response)) {
          console.log('✓ תגובת העגלה היא מערך ישיר');
          cartItems = response;
        } else if (response && typeof response === 'object') {
          console.log('🔍 תגובת העגלה היא אובייקט, מחפש property מתאים...');
          const resp = response as any;
          
          // Log structure
          const keys = Object.keys(resp);
          console.log('🔑 מפתחות בעגלה:', keys);
          console.log('📊 JSON עגלה:', JSON.stringify(response, null, 2));
          
          // Try all possible property names
          cartItems = resp.data || resp.Data || resp.items || resp.Items || 
                      resp.cart || resp.Cart || resp.value || resp.Value ||
                      resp.result || resp.Result || resp.list || resp.List ||
                      resp.cartItems || resp.CartItems || resp.purchases || resp.Purchases || [];
          
          console.log('🎯 נמצא property עגלה?', Array.isArray(cartItems) ? `כן, אורך: ${cartItems.length}` : 'לא');
          
          // If still not found, search all properties
          if (!Array.isArray(cartItems) || cartItems.length === 0) {
            console.log('🔧 מחפש מערך בכל ה-properties של העגלה...');
            
            for (const key of keys) {
              if (Array.isArray(resp[key])) {
                console.log(`✓ מצאתי מערך עגלה ב-property: "${key}", אורך: ${resp[key].length}`);
                cartItems = resp[key];
                break;
              }
            }
            
            // Last resort: Object.values
            if (!Array.isArray(cartItems) || cartItems.length === 0) {
              const values = Object.values(response);
              console.log('🔧 מנסה Object.values עבור עגלה');
              
              for (let i = 0; i < values.length; i++) {
                if (Array.isArray(values[i]) && (values[i] as any[]).length > 0) {
                  console.log(`✓ מצאתי מערך עגלה ב-values[${i}], אורך: ${(values[i] as any[]).length}`);
                  cartItems = values[i] as any[];
                  break;
                }
              }
            }
          }
        }
        
        console.log('📦 פריטי עגלה שחולצו:', cartItems.length);
        if (cartItems.length > 0) {
          console.log('📋 דוגמה לפריט ראשון בעגלה:', cartItems[0]);
        }
        
        if (Array.isArray(cartItems)) {
          this.cartItemsCount.set(cartItems.length);
          console.log('✅✅✅ הצלחה! מספר פריטים בעגלה:', cartItems.length);
        } else {
          console.log('⚠️ עגלה ריקה או לא נמצאה');
          this.cartItemsCount.set(0);
        }
      },
      error: (err) => {
        console.log('⚠️ לא ניתן לטעון עגלה (אולי לא מחובר):', err);
        this.cartItemsCount.set(0);
      }
    });
  }

  toggleChat(): void {
    this.isChatOpen.update(val => !val);
    this.isMinimized.set(false);
    
    // Send welcome message when opening for the first time
    if (this.isChatOpen() && this.messages().length === 0) {
      this.addBotMessage(this.welcomeMessage());
      this.showQuickActions.set(true);
    }
  }

  toggleMinimize(): void {
    this.isMinimized.update(val => !val);
  }

  handleQuickAction(action: string): void {
    this.showQuickActions.set(false);
    
    console.log('🎯 פעולה מהירה נלחצה:', action);
    
    // Add user message showing what they clicked
    const actionMessages: { [key: string]: string } = {
      'budget': 'מתנות במחיר נמוך',
      'cart': 'סטטוס העגלה שלי',
      'raffle': 'מידע על ההגרלה'
    };
    
    this.messages.update(msgs => [...msgs, {
      text: actionMessages[action],
      isBot: false,
      timestamp: new Date()
    }]);

    this.isTyping.set(true);

    // Enhanced typing delay
    setTimeout(() => {
      let response = '';
      
      switch(action) {
        case 'budget':
          response = this.getBudgetGifts(50); // Default budget filter at 50 NIS
          this.addBotMessage(response);
          this.isTyping.set(false);
          break;
        case 'cart':
          // Reload cart with callback - wait for actual data
          console.log('🔄 מרענן נתוני עגלה...');
          this.purchasesService.getCart().subscribe({
            next: (cartResponse) => {
              console.log('✅ עגלה נטענה מחדש עבור כפתור מהיר:', cartResponse);
              
              // Process cart data same way as loadCartCount
              let cartItems: any[] = [];
              if (Array.isArray(cartResponse)) {
                cartItems = cartResponse;
              } else if (cartResponse && typeof cartResponse === 'object') {
                const resp = cartResponse as any;
                cartItems = resp.data || resp.Data || resp.items || resp.Items || 
                           resp.cart || resp.Cart || resp.cartItems || resp.CartItems ||
                           resp.purchases || resp.Purchases || [];
                
                // Search all properties if not found
                if (!Array.isArray(cartItems) || cartItems.length === 0) {
                  const keys = Object.keys(resp);
                  for (const key of keys) {
                    if (Array.isArray(resp[key])) {
                      cartItems = resp[key];
                      break;
                    }
                  }
                }
              }
              
              // Update count
              this.cartItemsCount.set(Array.isArray(cartItems) ? cartItems.length : 0);
              console.log('🛒 עדכנתי ספירה לעגלה:', this.cartItemsCount());
              
              // Now show status
              response = this.getCartStatus();
              this.addBotMessage(response);
              this.isTyping.set(false);
            },
            error: (err) => {
              console.error('❌ שגיאה בטעינת עגלה:', err);
              this.cartItemsCount.set(0);
              response = this.getCartStatus();
              this.addBotMessage(response);
              this.isTyping.set(false);
            }
          });
          return; // Exit early for cart - callback handles response
        case 'raffle':
          response = 'ההגרלה תתקיים לאחר סיום המכירה הפומבית! 🎉\n\n📧 הזוכים יקבלו הודעה במייל\n🏆 כל כרטיס שרכשת נותן לך סיכוי לזכות\n⏰ התאריך המדויק יפורסם בקרוב';
          this.addBotMessage(response);
          this.isTyping.set(false);
          break;
      }
    }, 1500); // Enhanced 1.5 second typing delay
  }

  sendMessage(): void {
    const message = this.userInput().trim();
    if (!message || this.isTyping()) return;

    this.showQuickActions.set(false);

    // Add user message
    this.messages.update(msgs => [...msgs, {
      text: message,
      isBot: false,
      timestamp: new Date()
    }]);

    this.userInput.set('');
    this.isTyping.set(true);

    // Enhanced typing delay (1.5 seconds)
    setTimeout(() => {
      const botResponse = this.getBotResponse(message.toLowerCase());
      this.addBotMessage(botResponse);
      this.isTyping.set(false);
    }, 1500);
  }

  clearChat(): void {
    this.messages.set([]);
    this.showQuickActions.set(true);
    this.addBotMessage(this.welcomeMessage());
  }

  private addBotMessage(text: string): void {
    this.messages.update(msgs => [...msgs, {
      text,
      isBot: true,
      timestamp: new Date()
    }]);
  }

  private getBudgetGifts(budget: number): string {
    const gifts = this.giftsData();
    
    console.log('🔍 חיפוש מתנות עד', budget, 'ש"ח');
    console.log('📦 סך הכל מתנות טעונות:', gifts.length);
    
    if (gifts.length === 0) {
      return 'אני טוען את רשימת המתנות... רגע קטן! ⏳\n\nנסה שוב בעוד כמה שניות.';
    }
    
    const affordableGifts = gifts
      .filter(g => {
        const giftPrice = g.price || g.Price || g.ticketCost || g.TicketCost || 0;
        return giftPrice > 0 && giftPrice <= budget;
      })
      .slice(0, 3);

    console.log('✅ נמצאו מתנות במחיר נמוך:', affordableGifts.length);

    if (affordableGifts.length === 0) {
      return `לא מצאתי מתנות עד ${budget} ש"ח. 😔\n\nנסה תקציב גבוה יותר, למשל 100 ש"ח! 💰`;
    }

    let response = `מצאתי ${affordableGifts.length} מתנות מעולות עד ${budget} ש"ח:\n\n`;
    
    affordableGifts.forEach((gift, index) => {
      const price = gift.price || gift.Price || gift.ticketCost || gift.TicketCost || 0;
      const name = gift.name || gift.Name || 'מתנה ללא שם';
      response += `${index + 1}. 🎁 ${name}\n   מחיר: ${price} ש"ח\n\n`;
    });

    return response.trim();
  }

  private getPopularGift(): string {
    const gifts = this.giftsData();
    
    if (gifts.length === 0) {
      return 'אין מידע זמין כרגע. אנא נסה שוב מאוחר יותר.';
    }

    const popularGift = gifts.reduce((prev, current) => {
      const prevCount = prev.numOfCostermes || prev.NumOfCostermes || prev.purchaseCount || prev.PurchaseCount || 0;
      const currentCount = current.numOfCostermes || current.NumOfCostermes || current.purchaseCount || current.PurchaseCount || 0;
      return currentCount > prevCount ? current : prev;
    });

    const name = popularGift.name || popularGift.Name || 'מתנה';
    const count = popularGift.numOfCostermes || popularGift.NumOfCostermes || popularGift.purchaseCount || popularGift.PurchaseCount || 0;
    const price = popularGift.price || popularGift.Price || 0;

    return `המתנה הכי פופולרית היא:\n🔥 ${name}\n💰 מחיר: ${price} ש"ח\n👥 ${count} אנשים כבר רכשו כרטיסים!`;
  }

  private getCartStatus(): string {
    const count = this.cartItemsCount();
    
    console.log('🛒 בדיקת סטטוס עגלה, מספר פריטים:', count);
    
    if (count === 0) {
      return 'העגלה שלך ריקה כרגע. 🛒\n\nלמה לא תבדוק את המתנות המדהימות שלנו? יש לנו המון אופציות מעולות!';
    }

    const itemText = count === 1 ? 'פריט אחד' : `${count} פריטים`;
    return `יש לך ${itemText} בעגלה! 🛒✨\n\nכדי להשלים את הרכישה, לך לעמוד העגלה ולחץ על "אשר הזמנה".`;
  }

  private getBotResponse(message: string): string {
    // Budget filter - check if message contains a number
    const numberMatch = message.match(/\d+/);
    if (numberMatch) {
      const budget = parseInt(numberMatch[0]);
      if (budget > 0 && budget < 10000) {
        return this.getBudgetGifts(budget);
      }
    }

    // Popularity query
    if (message.includes('פופולרי') || message.includes('popular') || message.includes('מה נמכר') || message.includes('הכי נמכר')) {
      return this.getPopularGift();
    }

    // Cart status query
    if (message.includes('עגלה') || message.includes('cart') || message.includes('קניות')) {
      return this.getCartStatus();
    }

    // Gifts count query
    if (message.includes('כמה מתנות') || message.includes('מספר מתנות') || message.includes('how many gifts')) {
      const count = this.giftsCount();
      if (count > 0) {
        return `יש לנו כרגע ${count} מתנות מדהימות זמינות למכירה הפומבית! 🎁`;
      }
      return 'אנחנו טוענים את רשימת המתנות. בבקשה נסה שוב בעוד רגע.';
    }
    
    // Price queries
    if (message.includes('מחיר') || message.includes('כרטיס') || message.includes('עלות')) {
      return  'הכרטיסים שלנו מתחילים ב-10 ש"ח בלבד! 🎟️ יש לנו מגוון רחב של מתנות במחירים משתלמים.';
    }

    // Affordability query
    if (message.includes('יקר') || message.includes('expensive') || message.includes('משתלם')) {
      return 'הכרטיסים שלנו משתלמים מאוד, החל מ-10 ש"ח בלבד! 💰';
    }
    
    // Raffle/Winners queries
    if (message.includes('הגרלה') || message.includes('זוכים') || message.includes('מתי')) {
      return 'ההגרלה תתקיים לאחר סיום המכירה הפומבית. הזוכים יקבלו הודעה במייל. 📧';
    }
    
    // Who won query
    if (message.includes('מי זכה') || message.includes('who won') || message.includes('זכיתי')) {
      return 'הזוכים נקבעים רק לאחר סגירת המכירה. תקבל מייל אם תזכה! 🏆';
    }
    
    // Greetings
    if (message.includes('שלום') || message.includes('היי') || message.includes('הי') || message.includes('hello') || message.includes('hi')) {
      return this.welcomeMessage();
    }
    
    // Help query
    if (message.includes('עזרה') || message.includes('help') || message.includes('מה את יכול')) {
      return 'אני יכול לעזור לך עם:\n\n🎁 חיפוש מתנות לפי תקציב (פשוט כתוב מספר)\n📊 מידע על המתנה הכי פופולרית\n🛒 סטטוס העגלה שלך\n💰 מידע על מחירים והגרלה\n\nפשוט שאל אותי!';
    }
    
    // Default response
    return 'זו שאלה מעניינת! 🤔\n\nאתה יכול:\n• לכתוב סכום (לדוגמה "100") לחיפוש מתנות\n• לשאול "מה פופולרי?"\n• לבדוק את העגלה שלך\n• לשאול על המחירים וההגרלה';
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Template helper to get signal values
  get messagesValue() { return this.messages(); }
  get isChatOpenValue() { return this.isChatOpen(); }
  get isMinimizedValue() { return this.isMinimized(); }
  get isTypingValue() { return this.isTyping(); }
  get userInputValue() { return this.userInput(); }
  get showQuickActionsValue() { return this.showQuickActions(); }
  
  setUserInput(value: string) {
    this.userInput.set(value);
  }
}
