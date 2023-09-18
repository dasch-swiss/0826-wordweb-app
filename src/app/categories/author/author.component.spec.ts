import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {AuthorComponent} from "./author.component";

describe("AuthorComponent", () => {
    let component: AuthorComponent;
    let fixture: ComponentFixture<AuthorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [AuthorComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
