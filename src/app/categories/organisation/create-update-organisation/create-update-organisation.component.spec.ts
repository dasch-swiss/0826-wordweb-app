import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdateOrganisationComponent} from "./create-update-organisation.component";

describe("CreateUpdateOrganisationComponent", () => {
    let component: CreateUpdateOrganisationComponent;
    let fixture: ComponentFixture<CreateUpdateOrganisationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [CreateUpdateOrganisationComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateOrganisationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
