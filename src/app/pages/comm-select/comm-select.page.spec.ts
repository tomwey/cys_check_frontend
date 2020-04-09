import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommSelectPage } from './comm-select.page';

describe('CommSelectPage', () => {
  let component: CommSelectPage;
  let fixture: ComponentFixture<CommSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommSelectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
