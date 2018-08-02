import { TestBed, inject } from '@angular/core/testing';

import { UpdateavailabilityService } from './updateavailability.service';

describe('UpdateavailablityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateavailabilityService]
    });
  });

  it('should be created', inject([UpdateavailabilityService], (service: UpdateavailabilityService) => {
    expect(service).toBeTruthy();
  }));
});
