import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {InjectSessionInterceptor} from '@core/interceptors/inject-session.interceptor';
import {SocialLoginModule, SocialAuthServiceConfig} from "angularx-social-login";
import {GoogleLoginProvider} from "angularx-social-login";
import {environment} from 'src/environments/environment';
import {JwtHelperService, JWT_OPTIONS} from '@auth0/angular-jwt';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatNativeDateModule} from "@angular/material/core";
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {MatSnackBarModule} from '@angular/material/snack-bar';

registerLocaleData(localeEs, 'es');
const CLIENT_ID = environment.client_Id;

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-ES'},
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    {provide: HTTP_INTERCEPTORS, useClass: InjectSessionInterceptor, multi: true},
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true,
        providers: [{id: GoogleLoginProvider.PROVIDER_ID, provider: new GoogleLoginProvider(CLIENT_ID)}]
      } as SocialAuthServiceConfig
    },
    CookieService,
    JwtHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
