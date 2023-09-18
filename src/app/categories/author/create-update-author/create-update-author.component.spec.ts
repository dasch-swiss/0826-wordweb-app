import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdateAuthorComponent} from "./create-edit-author.component";

describe("CreateEditAuthorComponent", () => {
    let component: CreateUpdateAuthorComponent;
    let fixture: ComponentFixture<CreateUpdateAuthorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [CreateUpdateAuthorComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateAuthorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
