import { TestBed, inject } from '@angular/core/testing';

import { GetitemreportService } from './getitemreport.service';

describe('GetitemreportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetitemreportService]
    });
  });

  it('should be created', inject([GetitemreportService], (service: GetitemreportService) => {
    expect(service).toBeTruthy();
  }));
});
