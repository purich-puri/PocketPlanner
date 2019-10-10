import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateofflinePage } from './createoffline.page';

describe('CreateofflinePage', () => {
  let component: CreateofflinePage;
  let fixture: ComponentFixture<CreateofflinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateofflinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateofflinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
