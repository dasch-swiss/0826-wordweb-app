import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {SimpleSearchComponent} from "./simple-search.component";

describe("SimpleSearchComponent", () => {
    let component: SimpleSearchComponent;
    let fixture: ComponentFixture<SimpleSearchComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [SimpleSearchComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SimpleSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
