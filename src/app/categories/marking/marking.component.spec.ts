import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {MarkingComponent} from "./marking.component";

describe("MarkingComponent", () => {
    let component: MarkingComponent;
    let fixture: ComponentFixture<MarkingComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [MarkingComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MarkingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
