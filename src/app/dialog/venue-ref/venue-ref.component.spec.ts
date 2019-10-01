import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueRefComponent } from './venue-ref.component';

describe('VenueRefComponent', () => {
  let component: VenueRefComponent;
  let fixture: ComponentFixture<VenueRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
