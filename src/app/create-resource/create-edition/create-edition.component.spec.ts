import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateEditionComponent } from "./create-edition.component";

describe("CreateEditionComponent", () => {
  let component: CreateEditionComponent;
  let fixture: ComponentFixture<CreateEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
