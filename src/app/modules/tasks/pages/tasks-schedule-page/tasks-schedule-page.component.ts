import {Component, OnInit} from '@angular/core';
import {TasksService} from "@modules/tasks/services/tasks.service";
import {TaskModel} from "@core/models/task.model";

@Component({
  selector: 'app-tasks-schedule-page',
  templateUrl: './tasks-schedule-page.component.html',
  styleUrls: ['./tasks-schedule-page.component.css']
})
export class TasksSchedulePageComponent implements OnInit {

  tasks: TaskModel[] = [];

  constructor(private _tasksService: TasksService) {
  }

  ngOnInit(): void {

    this._tasksService.getAllTaskLists()
      .subscribe({
        next: tasksLists => {
          tasksLists.forEach(tasksList => {
            this._tasksService.getAllTasksByTaskListId(tasksList.id)
              .subscribe({
                next: tasks => {
                  if (!tasks) return;
                  tasks = tasks
                    .filter(task => task.parent === undefined)
                    .filter(task => task.due !== undefined)
                    .filter(task => task.status !== 'completed')
                    .filter(task => {
                      return this.#taskIsDueForToday(task);
                    });
                  tasks.forEach(task => task.taskList = tasksList);
                  this.tasks.push(...tasks);
                },
                error: err => {
                  console.error(err);
                }
              });
          });
        },
        error: err => {
          console.error(err);
        }
      });
  }

  #taskIsDueForToday(task: TaskModel): boolean {
    const now: Date = new Date();
    const due: Date = new Date(task.due);
    return due.toDateString() === now.toDateString();
  }

}
