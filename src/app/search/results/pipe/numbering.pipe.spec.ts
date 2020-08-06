import {NumberingPipe} from "./numbering.pipe";

describe("NumberingPipe", () => {
    it("create an instance", () => {
        const pipe = new NumberingPipe();
        expect(pipe).toBeTruthy();
    });
});
