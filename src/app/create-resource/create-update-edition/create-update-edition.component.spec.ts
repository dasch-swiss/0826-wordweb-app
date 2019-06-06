import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateUpdateEditionComponent } from "./create-update-edition.component";

describe("CreateUpdateEditionComponent", () => {
  let component: CreateUpdateEditionComponent;
  let fixture: ComponentFixture<CreateUpdateEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
