import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {PassageInfoComponent} from "./passage-info.component";

describe("PassageInfoComponent", () => {
    let component: PassageInfoComponent;
    let fixture: ComponentFixture<PassageInfoComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PassageInfoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PassageInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
