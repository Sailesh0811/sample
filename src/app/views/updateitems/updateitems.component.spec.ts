import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateitemsComponent } from './updateitems.component';

describe('UpdateitemsComponent', () => {
  let component: UpdateitemsComponent;
  let fixture: ComponentFixture<UpdateitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
