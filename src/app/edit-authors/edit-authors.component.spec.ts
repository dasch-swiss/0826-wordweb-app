import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditAuthorsComponent } from "./edit-authors.component";

describe("EditAuthorsComponent", () => {
  let component: EditAuthorsComponent;
  let fixture: ComponentFixture<EditAuthorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAuthorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
