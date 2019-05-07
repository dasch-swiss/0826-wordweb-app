import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InlineEditMultipleComponent } from "./inline-edit-multiple.component";

describe("InlineEditMultipleComponent", () => {
  let component: InlineEditMultipleComponent;
  let fixture: ComponentFixture<InlineEditMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
