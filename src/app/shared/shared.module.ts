import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {OrderByPipe} from './pipe/order-by.pipe';
import {FormTaskComponent} from './components/form-task/form-task.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    NavBarComponent,
    OrderByPipe,
    FormTaskComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule

  ],
  exports: [
    NavBarComponent,
    FormTaskComponent,
    OrderByPipe,
  ]
})
export class SharedModule {
}
