import {AuthorsPipe} from "./authors.pipe";

describe("AuthorsPipe", () => {
    it("create an instance", () => {
        const pipe = new AuthorsPipe();
        expect(pipe).toBeTruthy();
    });
});
