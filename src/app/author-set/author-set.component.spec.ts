import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthorSetComponent } from "./author-set.component";

describe("AuthorSetComponent", () => {
  let component: AuthorSetComponent;
  let fixture: ComponentFixture<AuthorSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
