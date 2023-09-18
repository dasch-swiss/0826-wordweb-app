import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {ContributorComponent} from "./contributor.component";

describe("ContributorComponent", () => {
    let component: ContributorComponent;
    let fixture: ComponentFixture<ContributorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [ContributorComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContributorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
