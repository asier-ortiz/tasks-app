import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskModel} from "@core/models/task.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {TaskListModel} from "@core/models/task-list.model";
import {TasksService} from "@modules/tasks/services/tasks.service";

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.css']
})
export class FormTaskComponent implements OnInit, OnDestroy {

  @Input() task$: Observable<TaskModel>;
  @Input() taskList$: Observable<TaskListModel>;
  @Output() callBackFormData: EventEmitter<any> = new EventEmitter<any>();

  formTask: FormGroup;
  isEditing: boolean = false;
  selectedTaskRef: TaskModel = null;
  selectTaskListRef: TaskListModel = null;
  taskLists: TaskListModel[];

  constructor(private _tasksService: TasksService, private _formBuilder: FormBuilder) {
  }

  ngOnDestroy(): void {
    this.formTask.reset();
  }

  ngOnInit(): void {

    this.formTask = this._formBuilder.group({
      list: new FormControl(null, []),
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      notes: new FormControl(null, [
        Validators.minLength(3)
      ]),
      due: new FormControl(null, []),
    });

    this._tasksService.getAllTaskLists()
      .subscribe({
        next: taskLists => {
          this.taskLists = taskLists;
          this.taskList$.subscribe(taskList => {
            this.selectTaskListRef = taskList;
          });
        },
        error: err => {
          console.error(err);
        }
      });

    this.task$.subscribe(task => {
      this.selectedTaskRef = task !== null ? task : null;
      this.isEditing = task !== null;
      this.formTask.patchValue({
        title: task?.title ?? '',
        notes: task?.notes ?? '',
        due: task?.due
      });
    }, error => {
      console.error(error);
    });

  }

  _getOptionsForTaskListSelect() {
    return this.taskLists?.filter(taskList => taskList.id !== this.selectTaskListRef?.id);
  }

  _onFormSubmit($event: any): void {

    const action: string = $event.submitter.id;
    const {list, title, notes, due} = this.formTask.value;

    const formData: any = {
      list: list,
      task: this.selectedTaskRef,
      action: action,
      title: title,
      notes: notes,
      due: due
    }

    this.callBackFormData.emit(formData);
    this.formTask.reset();
  }

}
