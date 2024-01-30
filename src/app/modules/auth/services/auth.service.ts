import {Injectable} from '@angular/core';
import {SocialAuthService, SocialUser} from "angularx-social-login";
import {BehaviorSubject} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: SocialUser = null;
  public signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Ref. https://auth0.com/blog/id-token-access-token-what-is-the-difference/
  constructor(private socialAuthService: SocialAuthService,
              private jwtHelperService: JwtHelperService,
              private cookieService: CookieService) {

    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      const idToken = user ? user.idToken : null;
      const authToken: string = this.cookieService.get('tasks-app-auth-token');
      this.signedIn.next(user !== null && !this.jwtHelperService.isTokenExpired(idToken) && authToken !== null);
    }, _ => {
      this.signedIn.next(false);
    });

  }
}
