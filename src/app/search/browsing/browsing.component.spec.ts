import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {BrowsingComponent} from "./browsing.component";

describe("BrowsingComponent", () => {
    let component: BrowsingComponent;
    let fixture: ComponentFixture<BrowsingComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BrowsingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrowsingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
