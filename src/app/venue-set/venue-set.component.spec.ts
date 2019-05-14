import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VenueSetComponent } from "./venue-set.component";

describe("VenueSetComponent", () => {
  let component: VenueSetComponent;
  let fixture: ComponentFixture<VenueSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
