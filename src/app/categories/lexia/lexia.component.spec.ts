import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {LexiaComponent} from "./lexia.component";

describe("LexiaComponent", () => {
    let component: LexiaComponent;
    let fixture: ComponentFixture<LexiaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LexiaComponent]
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
