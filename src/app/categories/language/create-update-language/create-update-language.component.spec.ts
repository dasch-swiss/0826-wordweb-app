import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdateLanguageComponent} from "./create-update-language.component";

describe("CreateUpdateLanguageComponent", () => {
    let component: CreateUpdateLanguageComponent;
    let fixture: ComponentFixture<CreateUpdateLanguageComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [CreateUpdateLanguageComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateLanguageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
