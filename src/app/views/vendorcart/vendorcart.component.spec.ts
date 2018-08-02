import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorcartComponent } from './vendorcart.component';

describe('VendorcartComponent', () => {
  let component: VendorcartComponent;
  let fixture: ComponentFixture<VendorcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
