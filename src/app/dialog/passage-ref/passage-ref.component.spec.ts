import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {PassageRefComponent} from "./passage-ref.component";

describe("PassageRefComponent", () => {
    let component: PassageRefComponent;
    let fixture: ComponentFixture<PassageRefComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [PassageRefComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PassageRefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
