import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPassageComponent } from './edit-passage.component';

describe('EditPassageComponent', () => {
  let component: EditPassageComponent;
  let fixture: ComponentFixture<EditPassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditPassageComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
