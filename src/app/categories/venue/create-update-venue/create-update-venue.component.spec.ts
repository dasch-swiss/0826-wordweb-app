import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateUpdateVenueComponent} from "./create-update-venue.component";

describe("CreateUpdateVenueComponent", () => {
    let component: CreateUpdateVenueComponent;
    let fixture: ComponentFixture<CreateUpdateVenueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateUpdateVenueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateVenueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
