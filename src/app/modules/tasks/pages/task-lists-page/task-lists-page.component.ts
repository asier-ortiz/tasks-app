import {Component, OnInit} from '@angular/core';
import {TasksService} from "@modules/tasks/services/tasks.service";
import {TaskListModel} from "@core/models/task-list.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-task-lists-page',
  templateUrl: './task-lists-page.component.html',
  styleUrls: ['./task-lists-page.component.css']
})
export class TaskListsPageComponent implements OnInit {

  tasksLists: TaskListModel[];
  formTasksList: FormGroup;
  snackBarRef: MatSnackBarRef<TextOnlySnackBar> = null;

  constructor(private _tasksService: TasksService, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {

    this.formTasksList = this._formBuilder.group({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
    });

    this._tasksService.getAllTaskLists()
      .subscribe({
        next: tasksLists => {
          this.tasksLists = tasksLists;
          this.tasksLists.forEach(tasksList => {
            this._tasksService.getAllTasksByTaskListId(tasksList.id)
              .subscribe({
                next: tasks => {
                  if (!tasks) return;
                  tasks = tasks.filter(task => task.parent === undefined);
                  this.tasksLists
                    .find(tl => tl.id === tasksList.id)
                    .tasksCount = tasks.length;
                },
                error: err => {
                  console.error(err);
                }
              })
          })
        },
        error: err => {
          console.error(err);
        }
      });
  }

  _onCreateNewTasksList(): void {
    const {title} = this.formTasksList.value;
    this._tasksService.createTaskList(title)
      .subscribe({
        next: taskList => {
          this.tasksLists.push(taskList);
          this.formTasksList.reset();
          this.#openSnackBar('Lista creada');
        },
        error: err => {
          this.#openSnackBar('Error: No se ha podido crear la lista');
          console.log(err);
        }
      });
  }

  #openSnackBar(message: string, action?: string, duration: number = 3_000) {
    this.snackBarRef = this._snackBar.open(message, action, {duration: duration});
  }

}
