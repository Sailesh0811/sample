import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeelayoutComponent } from './employeelayout.component';

describe('EmployeelayoutComponent', () => {
  let component: EmployeelayoutComponent;
  let fixture: ComponentFixture<EmployeelayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeelayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeelayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
