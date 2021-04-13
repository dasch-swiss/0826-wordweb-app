import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {TreeRefComponent} from "./tree-ref.component";

describe("LanguageRefComponent", () => {
    let component: TreeRefComponent;
    let fixture: ComponentFixture<TreeRefComponent>;

    beforeEach(waitForAsync(() => {
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
