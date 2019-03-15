import loadData, { mapColumns, getRecords, getList } from "../src/store/loaders";
import { data } from "./seed";

describe("Loading data", () => {
    test("should classify columns", () => {
        const classed = mapColumns(data);

        expect(classed).toEqual({
            times: [843253454535, 543253454535],
            columns: [[1, 2], [3, 4]],
            colors: ["C1", "C2"],
            types: ["T1", "T2"],
            labels: ["1", "2"]
        });
    });

    test("should get records", () => {
        const mapped = mapColumns(data);

        expect(getRecords(mapped)).toEqual({
            843253454535: [{ value: 1, color: "C1", label: "1" }, { value: 3, color: "C2", label: "2" }],
            543253454535: [{ value: 2, color: "C1", label: "1" }, { value: 4, color: "C2", label: "2" }]
        });
    });

    test("should get list of data", () => {
        const res = mapColumns(data);

        expect(getList(res)).toEqual([
            { color: "C1", type: "T1", label: "1", values: [{ value: 1, at: 0 }, { value: 2, at: 1 }] },
            { color: "C2", type: "T2", label: "2", values: [{ value: 3, at: 0 }, { value: 4, at: 1 }] }
        ]);
    });

    test("should load all data", () => {
        expect(loadData(data)).toEqual({
            list: [
                { color: "C1", type: "T1", label: "1", values: [{ value: 1, at: 0 }, { value: 2, at: 1 }] },
                { color: "C2", type: "T2", label: "2", values: [{ value: 3, at: 0 }, { value: 4, at: 1 }] }
            ],
            records: {
                843253454535: [{ value: 1, color: "C1", label: "1" }, { value: 3, color: "C2", label: "2" }],
                543253454535: [{ value: 2, color: "C1", label: "1" }, { value: 4, color: "C2", label: "2" }]
            },
            times: [543253454535, 843253454535]
        });
    });
});
