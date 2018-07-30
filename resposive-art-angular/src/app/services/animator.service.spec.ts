import { TestBed, inject } from '@angular/core/testing';

import { AnimatorService } from './animator.service';

describe('AnimatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimatorService]
    });
  });

  it('should be created', inject([AnimatorService], (service: AnimatorService) => {
    expect(service).toBeTruthy();
  }));
});
