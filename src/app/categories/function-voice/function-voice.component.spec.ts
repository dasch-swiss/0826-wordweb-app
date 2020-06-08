import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {FunctionVoiceComponent} from "./function-voice.component";

describe("FunctionVoiceComponent", () => {
    let component: FunctionVoiceComponent;
    let fixture: ComponentFixture<FunctionVoiceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FunctionVoiceComponent]
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
