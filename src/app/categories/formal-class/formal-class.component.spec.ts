import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {FormalClassComponent} from "./formal-class.component";

describe("FormalClassComponent", () => {
    let component: FormalClassComponent;
    let fixture: ComponentFixture<FormalClassComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FormalClassComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormalClassComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
