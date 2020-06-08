import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateUpdateLexiaComponent} from "./create-update-lexia.component";

describe("CreateUpdateLexiaComponent", () => {
    let component: CreateUpdateLexiaComponent;
    let fixture: ComponentFixture<CreateUpdateLexiaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateUpdateLexiaComponent]
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
