import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {FunctionVoiceComponent} from "./function-voice.component";

describe("FunctionVoiceComponent", () => {
    let component: FunctionVoiceComponent;
    let fixture: ComponentFixture<FunctionVoiceComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [FunctionVoiceComponent],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FunctionVoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
