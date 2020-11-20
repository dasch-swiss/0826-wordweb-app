import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {PassageRefComponent} from "./passage-ref.component";

describe("PassageRefComponent", () => {
    let component: PassageRefComponent;
    let fixture: ComponentFixture<PassageRefComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PassageRefComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PassageRefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
