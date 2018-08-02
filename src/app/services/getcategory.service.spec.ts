import { TestBed, inject } from '@angular/core/testing';

import { GetcategoryService } from './getcategory.service';

describe('GetcategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetcategoryService]
    });
  });

  it('should be created', inject([GetcategoryService], (service: GetcategoryService) => {
    expect(service).toBeTruthy();
  }));
});
