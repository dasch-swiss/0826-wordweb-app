import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {OrganisationComponent} from "./organisation.component";

describe("OrganisationComponent", () => {
    let component: OrganisationComponent;
    let fixture: ComponentFixture<OrganisationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OrganisationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrganisationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
