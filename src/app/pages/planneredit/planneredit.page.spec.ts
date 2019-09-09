import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannereditPage } from './planneredit.page';

describe('PlannereditPage', () => {
  let component: PlannereditPage;
  let fixture: ComponentFixture<PlannereditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannereditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannereditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
