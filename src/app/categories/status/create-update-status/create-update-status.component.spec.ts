import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateUpdateStatusComponent} from "./create-update-status.component";

describe("CreateUpdateStatusComponent", () => {
    let component: CreateUpdateStatusComponent;
    let fixture: ComponentFixture<CreateUpdateStatusComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateUpdateStatusComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
