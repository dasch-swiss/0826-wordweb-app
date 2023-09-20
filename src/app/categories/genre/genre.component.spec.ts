import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {GenreComponent} from "./genre.component";

describe("GenreComponent", () => {
    let component: GenreComponent;
    let fixture: ComponentFixture<GenreComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [GenreComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GenreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
