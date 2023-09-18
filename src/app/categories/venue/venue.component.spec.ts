import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {VenueComponent} from "./venue.component";

describe("VenueComponent", () => {
    let component: VenueComponent;
    let fixture: ComponentFixture<VenueComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [VenueComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VenueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
