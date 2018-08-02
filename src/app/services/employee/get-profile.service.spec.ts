import { TestBed, inject } from '@angular/core/testing';

import { GetProfileService } from './get-profile.service';

describe('GetProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetProfileService]
    });
  });

  it('should be created', inject([GetProfileService], (service: GetProfileService) => {
    expect(service).toBeTruthy();
  }));
});
