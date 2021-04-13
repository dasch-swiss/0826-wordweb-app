import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {BookRefComponent} from "./book-ref.component";

describe("BookRefComponent", () => {
    let component: BookRefComponent;
    let fixture: ComponentFixture<BookRefComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BookRefComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookRefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
