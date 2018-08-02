import { TestBed, inject } from '@angular/core/testing';

import { GetReportDataService } from './get-report-data.service';

describe('GetReportDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetReportDataService]
    });
  });

  it('should be created', inject([GetReportDataService], (service: GetReportDataService) => {
    expect(service).toBeTruthy();
  }));
});
