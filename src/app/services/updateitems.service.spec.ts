import { TestBed, inject } from '@angular/core/testing';

import { UpdateitemsService } from './updateitems.service';

describe('AdditemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateitemsService]
    });
  });

  it('should be created', inject([UpdateitemsService], (service: UpdateitemsService) => {
    expect(service).toBeTruthy();
  }));
});
