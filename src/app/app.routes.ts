import { Routes } from '@angular/router';
// import { FromGift } from './Components/from-gift/from-gift';
import { Gifts } from './Components/gifts/gifts';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import { DonatorsComponent } from './Components/donators/donators.component';
import { CartComponent } from './Components/cart/cart.component';
import { AdminPurchasesComponent } from './Components/admin-purchases/admin-purchases.component';
import { HomeComponent } from './Components/home/home.component';


export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path:'gifts', component: Gifts},
   { path: 'register', component: RegisterComponent },
   { path: 'login', component: LoginComponent }, 
     { path: 'donators', component: DonatorsComponent },
       { path: 'cart', component: CartComponent },
     {  path: 'admin/purchases', 
    component: AdminPurchasesComponent,
 //   canActivate: [AuthGuard],
    data: { role: 'manager' }
  }

];
