import {Component, OnDestroy, OnInit} from '@angular/core';
import {TasksService} from "@modules/tasks/services/tasks.service";
import {TaskModel} from "@core/models/task.model";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {TaskListModel} from "@core/models/task-list.model";
import {BehaviorSubject} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-task-list-page',
  templateUrl: './task-list-page.component.html',
  styleUrls: ['./task-list-page.component.css']
})
export class TaskListPageComponent implements OnInit, OnDestroy {

  tasksListId: string;
  tasks: TaskModel[];
  taskList: TaskListModel;
  selectedTask$ = new BehaviorSubject(null);
  selectedTaskList$ = new BehaviorSubject(null);
  movedTaskElement: Element = null;
  isDragging: boolean = false;
  formTasksList: FormGroup;
  snackBarRef: MatSnackBarRef<TextOnlySnackBar> = null;

  constructor(private _tasksService: TasksService,
              private _route: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {

    this.formTasksList = this._formBuilder.group({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
    });

    this._route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.tasksListId = params.get('id');
        return this._tasksService.getAllTasksByTaskListId(this.tasksListId);
      })
    ).subscribe({
      next: tasks => {
        this.tasks = tasks.filter(task => task.parent === undefined);
      },
      error: err => {
        console.error(err);
      }
    });

    this._tasksService.getTaskListById(this.tasksListId)
      .subscribe({
        next: taskList => {
          this.taskList = taskList;
          this.formTasksList.patchValue({
            title: taskList.title
          });
          this.selectedTaskList$.next(taskList);
        },
        error: err => {
          console.error(err);
        }
      });
  }

  ngOnDestroy(): void {
    this.selectedTask$.unsubscribe();
    this.selectedTaskList$.unsubscribe();
  }

  _onTaskPositionChanged(event: CdkDragDrop<TaskModel[], any>) {

    this.isDragging = false;
    this.movedTaskElement.classList.remove('highlighted');

    let prevIndex: number = event.previousIndex;
    let currIndex: number = event.currentIndex

    if (this.tasks.length < 2 || prevIndex === currIndex) return;

    const movedTask: TaskModel = this.tasks[prevIndex];
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    let previousTaskId: string = '';
    if (currIndex > 0) previousTaskId = this.tasks[currIndex - 1].id;

    this._tasksService.moveTaskPosition(this.tasksListId, movedTask.id, previousTaskId)
      .subscribe({
        next: updatedTask => {
          const index = this.tasks.indexOf(
            this.tasks.find(task => task.id === updatedTask.id)
          );
          this.tasks[index] = updatedTask;

        },
        error: err => {
          moveItemInArray(this.tasks, prevIndex, currIndex);
          this.#openSnackBar('Error: No se ha podido mover la tarea');
          console.error(err);
        }
      });

  }

  _onTaskStatusChanged($event: Event): void {
    const taskId: string = ($event.target as HTMLInputElement).value;
    const task: TaskModel = this.tasks.find(task => task.id === taskId);
    const newStatus: string = task.status === 'needsAction' ? 'completed' : 'needsAction';

    this._tasksService.setTaskStatus(this.taskList.id, task.id, newStatus)
      .subscribe({
        next: updatedTask => {
          const index = this.tasks.indexOf(task);
          this.tasks[index] = updatedTask;
          if (newStatus === 'completed') this.#openSnackBar('¡Tarea completada!');
        },
        error: err => {
          ($event.target as HTMLInputElement).checked = !($event.target as HTMLInputElement).checked;
          this.#openSnackBar('Error: No se ha podido modificar el estado de la tarea');
          console.error(err);
        }
      });
  }

  _onOpenTaskForm(task: TaskModel | null): void {
    this.selectedTask$.next(task);
  }

  _onTaskCreateEditMoveOrDelete($event): void {

    const taskList: TaskListModel = $event.list;
    const task: TaskModel = $event.task;
    let action: string = $event.action;
    const title: string = $event.title.trim();
    const notes: string = $event.notes.trim();
    const due: any = $event.due;

    if (taskList && action === 'edit') action = 'move';

    switch (action) {
      case 'create': {
        this._tasksService.createTask(this.taskList.id, title, notes, due)
          .subscribe({
            next: task => {
              this.tasks.splice(0, 0, task);
              this.#openSnackBar('Tarea creada');
            },
            error: err => {
              this.#openSnackBar('Error: No se ha podido crear la tarea');
              console.error(err);
            }
          });
        break;
      }

      case 'edit': {
        this._tasksService.updateTask(this.taskList.id, task.id, title, notes, due)
          .subscribe({
            next: updatedTask => {
              const index = this.tasks.indexOf(task);
              this.tasks[index] = updatedTask;
              this.#openSnackBar('Tarea actualizada');
            },
            error: err => {
              this.#openSnackBar('Error: No se ha podido actualizar la tarea');
              console.error(err);
            }
          });
        break;
      }

      case 'move': {
        this._tasksService.deleteTask(this.tasksListId, task.id)
          .subscribe({
            next: (_) => {
              this._tasksService.createTask(taskList.id, title, notes, due)
                .subscribe({
                  next: _ => {
                    const index = this.tasks.indexOf(task);
                    this.tasks.splice(index, 1);
                    this.#openSnackBar('Tarea actualizada');
                  },
                  error: err => {
                    const index = this.tasks.indexOf(task);
                    this.tasks.splice(index, 0, task);
                    this.#openSnackBar('Error: No se ha podido mover la tarea');
                    console.error(err);
                  }
                });
            },
            error: err => {
              this.#openSnackBar('Error: No se ha podido mover la tarea');
              console.error(err);
            }
          });
        break;
      }

      case 'delete': {
        let cancelDelete: boolean = false;
        this.#openSnackBar('Tarea eliminada', 'Deshacer', 6_000);
        const index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1);

        this.snackBarRef.onAction().subscribe(() => {
          this.tasks.splice(index, 0, task);
          cancelDelete = true;
        });

        this.snackBarRef.afterDismissed().subscribe(() => {

          if (!cancelDelete) {
            this._tasksService.deleteTask(this.tasksListId, task.id)
              .subscribe({
                next: (_) => {
                },
                error: err => {
                  this.#openSnackBar('Error: No se ha podido eliminar la tarea');
                  this.tasks.splice(index, 0, task);
                  console.error(err);
                }
              });
          }
        });
        break;
      }
    }
  }

  _onTasksListClear(): void {

    let cancelDelete: boolean = false;
    const completedTasks: TaskModel[] = this.tasks.filter(task => task.status !== 'needsAction');

    let indexedCompletedTasks: [number, TaskModel][] = [];
    completedTasks.forEach(task => indexedCompletedTasks.push([this.tasks.indexOf(task), task]));

    this.#openSnackBar('Tareas completadas eliminadas', 'Deshacer', 6_000);
    this.tasks = this.tasks.filter(task => task.status === 'needsAction');

    this.snackBarRef.onAction().subscribe(() => {

      indexedCompletedTasks.forEach(indexedTask => {
        const index: number = indexedTask[0];
        const task: TaskModel = indexedTask[1];
        this.tasks.splice(index, 0, task);
      })

      cancelDelete = true;
    });

    this.snackBarRef.afterDismissed().subscribe(() => {
      if (!cancelDelete) {
        this._tasksService.clear(this.tasksListId)
          .subscribe({
            next: (_) => {
            },
            error: err => {

              indexedCompletedTasks.forEach(indexedTask => {
                const index: number = indexedTask[0];
                const task: TaskModel = indexedTask[1];
                this.tasks.splice(index, 0, task);
              })

              this.#openSnackBar('Error: No se han podido eliminar las tareas');
              console.error(err);
            }
          });
      }
    });
  }

  _onTaskListEditOrDelete($event: any): void {
    const action: string = $event.submitter.id;
    const {title} = this.formTasksList.value;

    switch (action) {

      case 'edit': {
        const tempTaskList = this.taskList;
        tempTaskList.title = title.trim();

        this._tasksService.updateTaskList(tempTaskList)
          .subscribe({
            next: updatedTasksList => {
              this.taskList.title = updatedTasksList.title;
              this.#openSnackBar('Lista actualizada');
            },
            error: err => {
              this.#openSnackBar('Error: No se ha podido actualizar la lista');
              console.error(err);
            }
          });
        break;
      }

      case 'delete': {
        let cancelDelete: boolean = false;
        this.#openSnackBar('Eliminando la lista...', 'Cancelar', 6_000);

        this.snackBarRef.onAction().subscribe(() => {
          cancelDelete = true;
          this.snackBarRef.dismiss();
        });

        this.snackBarRef.afterDismissed().subscribe(() => {
          if (!cancelDelete) {
            this._tasksService.deleteTaskList(this.tasksListId)
              .subscribe({
                next: (_) => {
                  this._router.navigate(['/my-lists']);
                },
                error: err => {
                  this.#openSnackBar('Error: No se ha podido eliminar la lista');
                  console.error(err);
                }
              });
          }
        });
        break;
      }
    }
  }

  _countCompletedTasks(): number {
    if (!this.tasks) return 0;
    return this.tasks
      .filter(task => task.status !== 'needsAction')
      .length
  }

  _taskIsDue(taskDueDate: string): boolean {
    let now: Date = new Date();
    now.setHours(0, 0, 0, 0);
    const due: Date = new Date(taskDueDate);
    return due < now;
  }

  _mousedown($event: MouseEvent): void {
    this.isDragging = true;
    this.movedTaskElement = ($event.target as Element).closest('.list-group-item');
    this.movedTaskElement.classList.add('highlighted');
  }

  _mouseup($event: MouseEvent): void {
    this.isDragging = false;
    this.movedTaskElement = ($event.target as Element).closest('.list-group-item');
    this.movedTaskElement.classList.remove('highlighted');
  }

  #openSnackBar(message: string, action?: string, duration: number = 3_000) {
    this.snackBarRef = this._snackBar.open(message, action, {duration: duration});
  }

}
