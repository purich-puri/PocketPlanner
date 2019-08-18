import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemyplanPage } from './createmyplan.page';

describe('CreatemyplanPage', () => {
  let component: CreatemyplanPage;
  let fixture: ComponentFixture<CreatemyplanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatemyplanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatemyplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
