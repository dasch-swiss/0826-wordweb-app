import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryRefComponent } from './category-ref.component';

describe('CategoryRefComponent', () => {
  let component: CategoryRefComponent;
  let fixture: ComponentFixture<CategoryRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
