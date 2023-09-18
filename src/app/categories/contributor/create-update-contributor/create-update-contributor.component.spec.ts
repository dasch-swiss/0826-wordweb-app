import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdateContributorComponent} from "./create-update-contributor.component";

describe("CreateUpdateContributorComponent", () => {
    let component: CreateUpdateContributorComponent;
    let fixture: ComponentFixture<CreateUpdateContributorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [CreateUpdateContributorComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateContributorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
