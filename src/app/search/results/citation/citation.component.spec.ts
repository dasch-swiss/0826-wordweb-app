import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CitationComponent } from './citation.component';

describe('CitationComponent', () => {
  let component: CitationComponent;
  let fixture: ComponentFixture<CitationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CitationComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
