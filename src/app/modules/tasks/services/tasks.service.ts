import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs";
import {TaskListModel} from "@core/models/task-list.model";
import {TaskModel} from "@core/models/task.model";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // Ref. https://developers.google.com/tasks/reference/rest

  private readonly URL: string = environment.api_url;

  constructor(private _httpClient: HttpClient) {
  }

  ////////////////// TASKS-LISTS ENDPOINTS //////////////////

  getAllTaskLists(): Observable<TaskListModel[]> {
    return this._httpClient.get<TaskListModel[]>(`${this.URL}/users/@me/lists`)
      .pipe(
        map(({items}: any) => {
          return items;
        })
      );
  }

  getTaskListById(taskListId: string): Observable<TaskListModel> {
    return this._httpClient.get<TaskListModel>(`${this.URL}/users/@me/lists/${taskListId}`);
  }

  createTaskList(taskListTitle: string): Observable<TaskListModel> {
    return this._httpClient.post<TaskModel>(`${this.URL}/users/@me/lists`, {title: taskListTitle});
  }

  deleteTaskList(taskListId: string): Observable<TaskListModel> {
    return this._httpClient.delete<TaskModel>(`${this.URL}/users/@me/lists/${taskListId}`, {});
  }

  updateTaskList(taskList: TaskListModel): Observable<TaskListModel> {
    return this._httpClient.put<TaskModel>(`${this.URL}/users/@me/lists/${taskList.id}`, {...taskList});
  }

  ////////////////// TASKS ENDPOINTS //////////////////

  getAllTasksByTaskListId(taskListId: string): Observable<TaskModel[]> {
    return this._httpClient.get<TaskModel[]>(`${this.URL}/lists/${taskListId}/tasks`)
      .pipe(
        map(({items}: any) => {
          return items;
        })
      );
  }

  moveTaskPosition(taskListId: string, taskId: string, previousTaskId: string): Observable<TaskModel> {
    const body = new HttpParams()
      .set('previous', previousTaskId);

    return this._httpClient.post<TaskModel>(`${this.URL}/lists/${taskListId}/tasks/${taskId}/move`, body);
  }

  setTaskStatus(taskListId: string, taskId: string, status: string): Observable<TaskModel> {
    return this._httpClient.patch<TaskModel>(`${this.URL}/lists/${taskListId}/tasks/${taskId}`, {status: status});
  }

  createTask(taskListId: string, title: string, notes: string, due: string): Observable<TaskModel> {

    // Ref: https://medium.com/easyread/understanding-about-rfc-3339-for-datetime-formatting-in-software-engineering-940aa5d5f68a

    let dueDate: Date | null = null;

    if (due !== null) {
      dueDate = new Date(due);
      dueDate.setDate(dueDate.getDate() + 1);
      dueDate.setHours(0, 0, 0, 0);
    }

    const body = {
      title: title,
      notes: notes,
      due: dueDate ?? due
    };

    return this._httpClient.post<TaskModel>(`${this.URL}/lists/${taskListId}/tasks`, body);
  }


  updateTask(taskListId: string, taskId: string, title: string, notes: string, due: string) {
    let dueDate: Date | null = null;

    if (due !== null) {
      dueDate = new Date(due);
      dueDate.setDate(dueDate.getDate() + 1);
      dueDate.setHours(0, 0, 0, 0);
    }

    const body = {
      title: title,
      notes: notes,
      due: dueDate ?? due
    };

    return this._httpClient.patch<TaskModel>(`${this.URL}/lists/${taskListId}/tasks/${taskId}`, body);
  }


  deleteTask(taskListId: string, taskId: string): Observable<TaskModel> {
    return this._httpClient.delete<TaskModel>(`${this.URL}/lists/${taskListId}/tasks/${taskId}`);
  }

  clear(taskListId: string): Observable<TaskModel> {
    return this._httpClient.post<TaskModel>(`${this.URL}/lists/${taskListId}/clear`, {});
  }

}
