import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListsPageComponent } from './task-lists-page.component';

describe('TasksListPageComponent', () => {
  let component: TaskListsPageComponent;
  let fixture: ComponentFixture<TaskListsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
