import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateUpdateLanguageComponent} from "./create-update-language.component";

describe("CreateUpdateLanguageComponent", () => {
    let component: CreateUpdateLanguageComponent;
    let fixture: ComponentFixture<CreateUpdateLanguageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateUpdateLanguageComponent]
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
