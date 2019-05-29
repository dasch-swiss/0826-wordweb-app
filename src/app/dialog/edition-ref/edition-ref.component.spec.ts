import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditionRefComponent } from "./edition-ref.component";

describe("EditionRefComponent", () => {
  let component: EditionRefComponent;
  let fixture: ComponentFixture<EditionRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
