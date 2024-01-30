import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthService} from "@modules/auth/services/auth.service";

@Injectable()
export class InjectSessionInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router) {
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token: string = this.cookieService.get('tasks-app-auth-token');
    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,

          // Ref: https://betterprogramming.pub/how-to-prevent-http-request-caching-with-angular-httpclient-e82abf8b157d
          'Cache-Control': 'no-store',
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.authService.signedIn.next(false);
          this.router.navigate(['/login']);
        }
        return throwError(err);
      })
    );
  }

}
