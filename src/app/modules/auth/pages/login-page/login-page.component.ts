import {Component, OnInit} from '@angular/core';
import {SocialAuthService} from "angularx-social-login";
import {SocialUser} from "angularx-social-login";
import {GoogleLoginProvider} from "angularx-social-login";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {AuthService} from "@modules/auth/services/auth.service";
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  private scope: string = environment.scope

  constructor(private authService: AuthService,
              private socialAuthService: SocialAuthService,
              private cookieService: CookieService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  _signInWithGoogle(): void {

    const googleLoginOptions = {scope: this.scope};

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
      .then((user: SocialUser) => {
        console.log('USER --->', user);
        const {authToken} = user;
        this.cookieService.set('tasks-app-auth-token', authToken);
        this.router.navigate(['/my-lists']);
      })
      .catch(err => {
        console.log(err);
      });
  }

}
