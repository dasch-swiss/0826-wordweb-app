import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {PassageComponent} from "./passage.component";

describe("PassageComponent", () => {
    let component: PassageComponent;
    let fixture: ComponentFixture<PassageComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PassageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PassageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
