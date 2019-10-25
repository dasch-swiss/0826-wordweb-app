import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateGenderComponent } from './create-update-gender.component';

describe('CreateUpdateGenderComponent', () => {
  let component: CreateUpdateGenderComponent;
  let fixture: ComponentFixture<CreateUpdateGenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateGenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateGenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
