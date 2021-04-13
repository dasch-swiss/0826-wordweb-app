import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {CreateUpdatePassageComponent} from "./create-update-passage.component";

describe("CreateUpdatePassageComponent", () => {
    let component: CreateUpdatePassageComponent;
    let fixture: ComponentFixture<CreateUpdatePassageComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CreateUpdatePassageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdatePassageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
