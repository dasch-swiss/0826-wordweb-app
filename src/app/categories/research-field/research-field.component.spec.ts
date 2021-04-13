import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {ResearchFieldComponent} from "./research-field.component";

describe("ResearchFieldComponent", () => {
    let component: ResearchFieldComponent;
    let fixture: ComponentFixture<ResearchFieldComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ResearchFieldComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResearchFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
