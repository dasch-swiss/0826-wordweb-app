import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthorCategoryComponent } from "./author-category.component";

describe("AuthorCategoryComponent", () => {
  let component: AuthorCategoryComponent;
  let fixture: ComponentFixture<AuthorCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
