import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSchedulePageComponent } from './tasks-schedule-page.component';

describe('TaskSchedulePageComponent', () => {
  let component: TasksSchedulePageComponent;
  let fixture: ComponentFixture<TasksSchedulePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksSchedulePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
