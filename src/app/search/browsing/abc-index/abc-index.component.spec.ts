import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {AbcIndexComponent} from "./abc-index.component";

describe("AbcIndexComponent", () => {
    let component: AbcIndexComponent;
    let fixture: ComponentFixture<AbcIndexComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AbcIndexComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AbcIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
