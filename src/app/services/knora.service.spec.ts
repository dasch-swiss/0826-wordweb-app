import {TestBed} from "@angular/core/testing";

import {KnoraService} from "./knora.service";

describe("KnoraService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: KnoraService = TestBed.get(KnoraService);
        expect(service).toBeTruthy();
    });
});
