import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateUpdateAuthorComponent } from "./create-update-author.component";

describe("CreateUpdateAuthorComponent", () => {
  let component: CreateUpdateAuthorComponent;
  let fixture: ComponentFixture<CreateUpdateAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
