import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FillInComponent} from './fill-in.component';

describe('FillInComponent', () => {
    let component: FillInComponent;
    let fixture: ComponentFixture<FillInComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [FillInComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FillInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
