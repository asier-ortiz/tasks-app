import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "@modules/auth/pages/login-page/login-page.component";
import {HomePageComponent} from "@modules/home/pages/home-page/home-page.component";
import {SessionGuard} from "@core/guards/session.guard";
import {SessionReverseGuard} from "@core/guards/session-reverse.guard";

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [SessionReverseGuard],
  },
  {
    path: '',
    component: HomePageComponent,
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [SessionGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
