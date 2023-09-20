import {TestBed} from "@angular/core/testing";

import {TreeTableService} from "./tree-table.service";

describe("TreeTableServiceService", () => {
    beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

    it("should be created", () => {
        const service: TreeTableService = TestBed.get(TreeTableService);
        expect(service).toBeTruthy();
    });
});
