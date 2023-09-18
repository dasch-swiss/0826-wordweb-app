import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {LexiaComponent} from "./lexia.component";

describe("LexiaComponent", () => {
    let component: LexiaComponent;
    let fixture: ComponentFixture<LexiaComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [LexiaComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LexiaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
