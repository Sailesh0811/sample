import { TestBed, inject } from '@angular/core/testing';

import { GetitemsService } from './getitems.service';

describe('GetitemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetitemsService]
    });
  });

  it('should be created', inject([GetitemsService], (service: GetitemsService) => {
    expect(service).toBeTruthy();
  }));
});
