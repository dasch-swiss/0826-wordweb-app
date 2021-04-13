import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {AuthorRefComponent} from "./author-ref.component";

describe("AuthorRefComponent", () => {
    let component: AuthorRefComponent;
    let fixture: ComponentFixture<AuthorRefComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AuthorRefComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthorRefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
