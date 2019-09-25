import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResearchFieldComponent } from "./research-field.component";

describe("ResearchFieldComponent", () => {
  let component: ResearchFieldComponent;
  let fixture: ComponentFixture<ResearchFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
