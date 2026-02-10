import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

// הגדרת מבנה התשובה מהשרת כדי שהקוד יהיה ברור
interface AuthResponse {
  token?: string;
  Token?: string; // Support PascalCase from C#
  role?: string;
  Role?: string; // Support PascalCase from C#
  userName?: string;
  UserName?: string; // Support PascalCase from C#
}

// פונקציית עזר לפענוח JWT
interface DecodedToken {
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  name?: string;
  email?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7239/api/auth';
  private http = inject(HttpClient);

  // 1. login - התחברות
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    console.log('🔐 LOGIN REQUEST:', {
      url: `${this.apiUrl}/login`,
      body: credentials,
      timestamp: new Date().toISOString()
    });
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('✅ LOGIN SUCCESS:', response);
        this.setSession(response);
      })
    );
  }

  // 2. register - הרשמה
  register(userInfo: { email: string; password: string; name: string; phone: string; address: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userInfo).pipe(
      tap(response => this.setSession(response))
    );
  }

  // 3. logout - התנתקות
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    console.log('התנתקת מהמערכת בהצלחה!');
  }

  // 4. isAuthenticated - בדיקה אם מחובר
  get isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // בדיקה אם ה-token פג תוקף
    const decoded = this.decodeToken(token);
    if (decoded?.exp) {
      const isExpired = Date.now() >= decoded.exp * 1000;
      if (isExpired) {
        this.logout();
        return false;
      }
    }
    
    return true;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    console.log('Checking isAdmin - role from localStorage:', role);
    
    // אם אין role ב-localStorage, ננסה לפענח מה-token
    if (!role) {
      const token = this.getToken();
      if (token) {
        const decoded = this.decodeToken(token);
        console.log('Decoded token:', decoded);
        
        // לפעמים ה-role מגיע בשדה מיוחד של Microsoft
        const tokenRole = decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log('Role from token:', tokenRole);
        
        if (tokenRole) {
          localStorage.setItem('role', tokenRole);
          const normalizedRole = tokenRole.toLowerCase();
          return normalizedRole === 'admin' || normalizedRole === 'manager';
        }
      }
      return false;
    }
    
    // בדיקה גם של admin וגם של manager (case-insensitive)
    const normalizedRole = role.toLowerCase();
    const isAdminOrManager = normalizedRole === 'admin' || normalizedRole === 'manager';
    console.log('isAdmin result:', isAdminOrManager, '(normalized role:', normalizedRole + ')');
    return isAdminOrManager;
  }

  isManager(): boolean {
    const role = this.getUserRole();
    if (!role) return false;
    
    const normalizedRole = role.toLowerCase();
    return normalizedRole === 'manager';
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  private setSession(response: AuthResponse): void {
    // CRUCIAL: Clear all previous auth data before saving new login
    localStorage.clear();
    console.log('🧹 Cleared localStorage before new login');
    
    // Extract token (support both camelCase and PascalCase)
    const token = response.token || response.Token;
    
    if (token) {
      localStorage.setItem('token', token);
      console.log('💾 Saved token');
      
      // Extract role - save EXACTLY as received from server
      const role = response.role || response.Role;
      
      if (role) {
        // Save role exactly as server sends it (Manager, manager, Customer, etc.)
        localStorage.setItem('role', role);
        console.log('💾 Saved role from response:', role);
      } else {
        // Fallback: Try to extract from token
        const decoded = this.decodeToken(token);
        console.log('Setting session - decoded token:', decoded);
        
        const tokenRole = decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (tokenRole) {
          localStorage.setItem('role', tokenRole);
          console.log('💾 Saved role from token:', tokenRole);
        }
      }
      
      // Extract userName
      const userName = response.userName || response.UserName;
      if (userName) {
        localStorage.setItem('userName', userName);
        console.log('💾 Saved userName:', userName);
      } else {
        const decoded = this.decodeToken(token);
        if (decoded?.name) {
          localStorage.setItem('userName', decoded.name);
          console.log('💾 Saved userName from token:', decoded.name);
        }
      }
      
      // Final verification
      console.log('✅ Session set complete:', {
        token: '***' + token.slice(-10),
        role: localStorage.getItem('role'),
        userName: localStorage.getItem('userName')
      });
    } else {
      console.error('❌ No token in response!');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // פענוח JWT Token
  private decodeToken(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
