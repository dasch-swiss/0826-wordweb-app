import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateUpdateBookComponent} from "./create-update-book.component";

describe("CreateUpdateBookComponent", () => {
    let component: CreateUpdateBookComponent;
    let fixture: ComponentFixture<CreateUpdateBookComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateUpdateBookComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateBookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
