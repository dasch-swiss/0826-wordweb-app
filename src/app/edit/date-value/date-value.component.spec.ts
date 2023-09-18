import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateValueComponent } from './date-value.component';

describe('DateValueComponent', () => {
  let component: DateValueComponent;
  let fixture: ComponentFixture<DateValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DateValueComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
