import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassageComponent } from './passage.component';

describe('PassageComponent', () => {
  let component: PassageComponent;
  let fixture: ComponentFixture<PassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
