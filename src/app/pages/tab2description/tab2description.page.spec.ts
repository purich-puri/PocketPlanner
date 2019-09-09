import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab2descriptionPage } from './tab2description.page';

describe('Tab2descriptionPage', () => {
  let component: Tab2descriptionPage;
  let fixture: ComponentFixture<Tab2descriptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab2descriptionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab2descriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
