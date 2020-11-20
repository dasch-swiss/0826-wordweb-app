import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {BookRefComponent} from "./book-ref.component";

describe("BookRefComponent", () => {
    let component: BookRefComponent;
    let fixture: ComponentFixture<BookRefComponent>;

    beforeEach(async(() => {
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
