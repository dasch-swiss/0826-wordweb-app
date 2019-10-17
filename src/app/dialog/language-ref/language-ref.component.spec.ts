import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageRefComponent } from './language-ref.component';

describe('LanguageRefComponent', () => {
  let component: LanguageRefComponent;
  let fixture: ComponentFixture<LanguageRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
