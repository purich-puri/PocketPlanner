import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripplannerPage } from './tripplanner.page';

describe('TripplannerPage', () => {
  let component: TripplannerPage;
  let fixture: ComponentFixture<TripplannerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripplannerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripplannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
