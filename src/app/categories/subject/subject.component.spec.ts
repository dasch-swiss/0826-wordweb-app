import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {SubjectComponent} from "./subject.component";

describe("SubjectComponent", () => {
    let component: SubjectComponent;
    let fixture: ComponentFixture<SubjectComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [SubjectComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
