import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationRefComponent } from './organisation-ref.component';

describe('OrganisationRefComponent', () => {
  let component: OrganisationRefComponent;
  let fixture: ComponentFixture<OrganisationRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
