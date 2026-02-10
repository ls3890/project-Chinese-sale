// import { Component, inject, model } from '@angular/core';
// import { GiftService } from '../../services/gift-service';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import {CommonModule} from '@angular/common'
// import { giftModel } from '../../modeles/giftListModel';
// @Component({
//   selector: 'app-from-gift',
//   imports: [ReactiveFormsModule,CommonModule],
//   templateUrl: './from-gift.html',
//   styleUrl: './from-gift.scss',
// })
// export class FromGift {

//   gifSrv: GiftService = inject(GiftService)

//   giftForm: FormGroup = new FormGroup({
//     id: new FormControl(0, [Validators.required, Validators.max(999999999)]),
//     giftName: new FormControl("", [Validators.required, Validators.minLength(2)]),
//     donatorName: new FormControl("", [Validators.required, Validators.minLength(2)]),
//     price: new FormControl(10, [Validators.required, Validators.min(5), Validators.max(100)])
//   });

//   saveNewGift(){
//     let g: giftModel = new giftModel();
//     g.id = this.giftForm.controls['id'].value;
//     g.giftName = this.giftForm.controls['giftName'].value;
//     g.donatorName = this.giftForm.controls['donatorName'].value;
//     g.price = this.giftForm.controls['price'].value;
//     console.log("g", g);

//     if (g.id && g.id > 0) {
//       console.log("dddd");
      
//       this.gifSrv.update(g).subscribe({
//         next: () => console.log('עודכן בהצלחה'),
//         error: (err: any) => console.error('שגיאה בעדכון:', err)
//       });
//     } else {
//       this.gifSrv.add(g).subscribe({
//         next: () => console.log('נוסף בהצלחה'),
//         error: (err: any) => console.error('שגיאה בהוספה:', err)
//       });
//     }
//   }



// }
