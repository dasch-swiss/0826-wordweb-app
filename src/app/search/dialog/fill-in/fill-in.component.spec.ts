import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FillInComponent} from './fill-in.component';

describe('FillInComponent', () => {
    let component: FillInComponent;
    let fixture: ComponentFixture<FillInComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FillInComponent]
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
