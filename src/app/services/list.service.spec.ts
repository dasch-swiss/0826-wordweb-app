import {TestBed} from "@angular/core/testing";

import {ListService} from "./list.service";

describe("ListService", () => {
    beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

    it("should be created", () => {
        const service: ListService = TestBed.get(ListService);
        expect(service).toBeTruthy();
    });
});
