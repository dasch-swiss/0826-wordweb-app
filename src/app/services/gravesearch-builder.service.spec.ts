import {TestBed} from "@angular/core/testing";

import {GravsearchBuilderService} from "./gravsearch-builder.service";

describe("GravesearchBuilderService", () => {
    beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

    it("should be created", () => {
        const service: GravsearchBuilderService = TestBed.get(GravsearchBuilderService);
        expect(service).toBeTruthy();
    });
});
