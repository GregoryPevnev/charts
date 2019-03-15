import { mapColumns, getResult, loadData } from "../src/store/loaders";

describe("Loading tests", () => {
    const data = [["x", 100, 200], ["y1", 1, 2], ["y2", 3, 4]];

    test("should classify columns", () => {
        const classed = mapColumns(data);
        expect(classed).toEqual({
            times: [100, 200],
            columns: [[1, 2], [3, 4]]
        });
    });
});
