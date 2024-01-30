import {Component, OnInit} from '@angular/core';
import {SocialAuthService} from "angularx-social-login";
import {Router} from "@angular/router";
import {AuthService} from "@modules/auth/services/auth.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  menuItems: Array<any> = [];

  constructor(readonly _authService: AuthService,
              private _socialAuthService: SocialAuthService,
              private _router: Router) {
  }

  ngOnInit(): void {

    this.menuItems = [
      {
        name: 'Mis listas',
        icon: 'bi-list-task',
        router: ['/my-lists']
      },
      {
        name: 'Hoy',
        icon: 'bi-calendar-check',
        router: ['/schedule']
      }
    ];

  }

  _signOut(): void {
    this._socialAuthService.signOut()
      .then((_) => {
        this._router.navigate(['/login']);
      }, error => {
        console.error(error);
        this._router.navigate(['/login']);
      });
  }

}
