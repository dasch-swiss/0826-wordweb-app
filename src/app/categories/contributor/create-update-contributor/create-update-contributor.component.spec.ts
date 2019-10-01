import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateContributorComponent } from './create-update-contributor.component';

describe('CreateUpdateContributorComponent', () => {
  let component: CreateUpdateContributorComponent;
  let fixture: ComponentFixture<CreateUpdateContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
