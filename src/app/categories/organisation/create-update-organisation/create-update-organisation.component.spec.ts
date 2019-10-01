import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateOrganisationComponent } from './create-update-organisation.component';

describe('CreateUpdateOrganisationComponent', () => {
  let component: CreateUpdateOrganisationComponent;
  let fixture: ComponentFixture<CreateUpdateOrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateOrganisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
