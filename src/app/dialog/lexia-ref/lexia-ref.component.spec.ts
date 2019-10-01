import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LexiaRefComponent } from './lexia-ref.component';

describe('LexiaRefComponent', () => {
  let component: LexiaRefComponent;
  let fixture: ComponentFixture<LexiaRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LexiaRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LexiaRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
