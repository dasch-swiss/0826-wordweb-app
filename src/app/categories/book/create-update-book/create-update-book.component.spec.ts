import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdateBookComponent} from "./create-update-book.component";

describe("CreateUpdateBookComponent", () => {
    let component: CreateUpdateBookComponent;
    let fixture: ComponentFixture<CreateUpdateBookComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [CreateUpdateBookComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateBookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
