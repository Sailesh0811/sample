import { TestBed, inject } from '@angular/core/testing';

import { UpdateorderService } from './updateorder.service';

describe('UpdateorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateorderService]
    });
  });

  it('should be created', inject([UpdateorderService], (service: UpdateorderService) => {
    expect(service).toBeTruthy();
  }));
});
