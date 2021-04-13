import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {GenderComponent} from "./gender.component";

describe("GenderComponent", () => {
    let component: GenderComponent;
    let fixture: ComponentFixture<GenderComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [GenderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
