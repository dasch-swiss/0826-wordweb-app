import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLexiaComponent } from './edit-lexia.component';

describe('EditLexiaComponent', () => {
  let component: EditLexiaComponent;
  let fixture: ComponentFixture<EditLexiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLexiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLexiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
