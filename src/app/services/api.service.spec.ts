import {TestBed} from "@angular/core/testing";

import {ApiService} from "./api.service";

describe("ApiService", () => {
    beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

    it("should be created", () => {
        const service: ApiService = TestBed.get(ApiService);
        expect(service).toBeTruthy();
    });
});
