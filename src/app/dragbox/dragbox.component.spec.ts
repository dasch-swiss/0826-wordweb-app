import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DragboxComponent } from "./dragbox.component";

describe("DragboxComponent", () => {
  let component: DragboxComponent;
  let fixture: ComponentFixture<DragboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
