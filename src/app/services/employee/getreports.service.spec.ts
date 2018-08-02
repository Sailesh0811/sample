import { TestBed, inject } from '@angular/core/testing';

import { GetreportsService } from './getreports.service';

describe('GetreportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetreportsService]
    });
  });

  it('should be created', inject([GetreportsService], (service: GetreportsService) => {
    expect(service).toBeTruthy();
  }));
});
