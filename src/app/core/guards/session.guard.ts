import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "@modules/auth/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable(subscriber => {
      this.authService.signedIn.subscribe((signedIn: boolean) => {
        if (signedIn) return subscriber.next(true);
        return subscriber.next(this.router.createUrlTree(['/', 'login']));
      });
    });

  }
}
