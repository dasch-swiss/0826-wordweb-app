import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {TreeRefComponent} from "./tree-ref.component";

describe("LanguageRefComponent", () => {
    let component: TreeRefComponent;
    let fixture: ComponentFixture<TreeRefComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TreeRefComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeRefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
