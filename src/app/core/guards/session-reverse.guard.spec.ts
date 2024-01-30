import { TestBed } from '@angular/core/testing';

import { SessionReverseGuard } from './session-reverse.guard';

describe('SessionReverseGuard', () => {
  let guard: SessionReverseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SessionReverseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
