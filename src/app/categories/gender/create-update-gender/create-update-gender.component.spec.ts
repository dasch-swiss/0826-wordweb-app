import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdateGenderComponent} from "./create-update-gender.component";

describe("CreateUpdateGenderComponent", () => {
    let component: CreateUpdateGenderComponent;
    let fixture: ComponentFixture<CreateUpdateGenderComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [CreateUpdateGenderComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateGenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
