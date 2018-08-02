import { TestBed, inject } from '@angular/core/testing';

import { AdditemsService } from './additems.service';

describe('AdditemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdditemsService]
    });
  });

  it('should be created', inject([AdditemsService], (service: AdditemsService) => {
    expect(service).toBeTruthy();
  }));
});
