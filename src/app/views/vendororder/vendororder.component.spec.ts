import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendororderComponent } from './vendororder.component';

describe('VendororderComponent', () => {
  let component: VendororderComponent;
  let fixture: ComponentFixture<VendororderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendororderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendororderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
