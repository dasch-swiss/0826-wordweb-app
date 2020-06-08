import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateUpdateGenreComponent} from "./create-update-genre.component";

describe("CreateUpdateGenreComponent", () => {
    let component: CreateUpdateGenreComponent;
    let fixture: ComponentFixture<CreateUpdateGenreComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateUpdateGenreComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateUpdateGenreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
