import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdateLexiaComponent} from "./create-update-lexia.component";

describe("CreateUpdateLexiaComponent", () => {
    let component: CreateUpdateLexiaComponent;
    let fixture: ComponentFixture<CreateUpdateLexiaComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [CreateUpdateLexiaComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateLexiaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
