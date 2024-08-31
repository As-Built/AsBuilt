import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private _authorities$ = new BehaviorSubject<string[]>([]);
  public readonly authorities$ = this._authorities$.asObservable();

  constructor(private apiService: ApiService, private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
    this.extractAuthorities(token);
  }

  login(id: number, name: string) {
    return this.apiService.login(id, name).pipe(
      tap((response: any) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem('token', response.token);
        this.extractAuthorities(response.token);
      })
    );
  }

  private extractAuthorities(token: string | null) {
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const authorities = decodedToken?.user.roles ?? [];
      this._authorities$.next(authorities);
    } else {
      this._authorities$.next([]);
    }
  }

  public updateAuthorities(authorities: string[]) {
    this._authorities$.next(authorities);
  }
  
}