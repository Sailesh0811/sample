import { TestBed, inject } from '@angular/core/testing';

import { GetorderService } from './getorder.service';

describe('GetorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetorderService]
    });
  });

  it('should be created', inject([GetorderService], (service: GetorderService) => {
    expect(service).toBeTruthy();
  }));
});
