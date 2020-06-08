import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {FormalClassComponent} from "./formal-class.component";

describe("FormalClassComponent", () => {
    let component: FormalClassComponent;
    let fixture: ComponentFixture<FormalClassComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormalClassComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormalClassComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
