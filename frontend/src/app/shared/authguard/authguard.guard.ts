import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AuthguardService } from './authguard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authguardService: AuthguardService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const authority = payload.user.roles[0];
    const requiredAuthorities: string[] = route.data['authorities'] || [];

    return this.authguardService.isLoggedIn$.pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          alert("Para essa função é necessário realizar o login");
          this.router.navigate(['login']);
          return of(false);
        }

        return this.authguardService.authorities$.pipe(
          take(1),
          switchMap((authorities) => {
            if (requiredAuthorities.some((authority) => authorities.includes(authority))) {
              return of(true);
            } else {
              alert("Acesso negado. Você não tem as autoridades necessárias.");
              return of(this.router.createUrlTree(['/home']));
            }
          })
        );
      })
    );
  }
}