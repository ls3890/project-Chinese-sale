// import { Component, inject, OnInit } from '@angular/core';
// import { giftModel } from '../../modeles/giftListModel';
// import { GiftService } from '../../services/gift-service';

// @Component({
//   selector: 'app-gift-list',
//   imports: [],
//   templateUrl: './gift-list.html',
//   styleUrl: './gift-list.scss',
// })
// export class GiftList implements OnInit {
//   giftSrv: GiftService = inject(GiftService);
//   giftVac: giftModel[] = [];

//   ngOnInit() {
//     this.loadGifts();
//   }

//   loadGifts() {
//     this.giftSrv.getAll().subscribe({
//       next: (data) => {
//         console.log('נתונים טעונים:', data);
//         this.giftVac = data;
//       },
//       error: (err) => {
//         console.error('שגיאה בטעינת המתנות:', err.message);
//       }
//     });
//   }

// }
