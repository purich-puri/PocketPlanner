import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerofflinePage } from './planneroffline.page';

describe('PlannerofflinePage', () => {
  let component: PlannerofflinePage;
  let fixture: ComponentFixture<PlannerofflinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerofflinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerofflinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
