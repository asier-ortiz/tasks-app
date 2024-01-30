import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TasksRoutingModule} from './tasks-routing.module';
import {TaskListsPageComponent} from './pages/task-lists-page/task-lists-page.component';
import {TaskListPageComponent} from './pages/task-list-page/task-list-page.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {SharedModule} from "@shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TasksSchedulePageComponent} from './pages/tasks-schedule-page/tasks-schedule-page.component';

@NgModule({
  declarations: [
    TaskListsPageComponent,
    TaskListPageComponent,
    TasksSchedulePageComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    DragDropModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TasksModule {
}
