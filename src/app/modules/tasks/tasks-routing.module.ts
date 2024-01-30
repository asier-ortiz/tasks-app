import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskListsPageComponent} from "@modules/tasks/pages/task-lists-page/task-lists-page.component";
import {TaskListPageComponent} from "@modules/tasks/pages/task-list-page/task-list-page.component";
import {TasksSchedulePageComponent} from "@modules/tasks/pages/tasks-schedule-page/tasks-schedule-page.component";

const routes: Routes = [
  {
    path: 'schedule',
    component: TasksSchedulePageComponent,
    pathMatch: 'full'
  },
  {
    path: 'my-lists',
    component: TaskListsPageComponent,
    data: {
      animation: 'list'
    }
  },
  {
    path: 'my-lists/:id',
    component: TaskListPageComponent,
    data: {
      animation: 'lists'
    }
  },
  {
    path: '',
    redirectTo: 'my-lists',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'my-lists'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {
}
