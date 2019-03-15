import {
    createActiveGetter,
    createMaxGetter,
    createDatesLoader,
    createRangeLoader,
    createOffsetGetter,
    createRecordGetter
} from "../src/store/mappers";
import { getStore } from "./seed";

describe("Max-Getting", () => {
    test("should get maximum inside of a FULL range", () => {
        const store = getStore({
            from: 0, // Percentage
            to: 0,

            states: [true, true]
        });

        expect(createMaxGetter(store)(0, 1)).toBe(8);
    });

    test("should get maximum inside of a SPECIFIC range", () => {
        const store = getStore({
            from: 0.25, // Percentage
            to: 0.75,

            states: [true, true]
        });

        expect(createMaxGetter(store)()).toBe(6);
    });

    test("should get maximum with inactive columns", () => {
        const store = getStore({
            from: 0, // Percentage
            to: 1,

            states: [true, false]
        });

        expect(createMaxGetter(store)()).toBe(7);
    });
});

describe("Range-Getting", () => {
    test("should get a FULL range", () => {
        const store = getStore({
            from: 0, // Percentage
            to: 0,

            states: [true, true]
        });

        expect(createRangeLoader(store)(0, 1)).toEqual([
            {
                color: "C1",
                type: "T1",
                label: "1",
                values: [
                    { value: 0.125, at: 0 },
                    { value: 0.125 * 2, at: 1 },
                    { value: 0.125 * 5, at: 3 },
                    { value: 0.125 * 7, at: 4 }
                ]
            },
            {
                color: "C2",
                type: "T2",
                label: "2",
                values: [
                    { value: 0.125 * 3, at: 0 },
                    { value: 0.125 * 4, at: 1 },
                    { value: 0.125 * 6, at: 3 },
                    { value: 0.125 * 8, at: 4 }
                ]
            }
        ]);
    });

    test("should get range with inactive columns", () => {
        const store = getStore({
            from: 0, // Percentage
            to: 1,

            states: [false, true]
        });

        expect(createRangeLoader(store)()).toEqual([
            {
                color: "C1",
                type: "T1",
                label: "1",
                values: [{ value: 1.5, at: 0 }, { value: 1.5, at: 1 }, { value: 1.5, at: 3 }, { value: 1.5, at: 4 }]
            },
            {
                color: "C2",
                type: "T2",
                label: "2",
                values: [
                    { value: 0.125 * 3, at: 0 },
                    { value: 0.125 * 4, at: 1 },
                    { value: 0.125 * 6, at: 3 },
                    { value: 0.125 * 8, at: 4 }
                ]
            }
        ]);
    });
});

describe("Getting Records", () => {
    test("should get active record", () => {
        const store = getStore({ selected: 1 });

        expect(createRecordGetter(store)()).toEqual({
            title: "Wed, Dec 31",
            at: 0.25,
            data: [{ value: 2, color: "C1", label: "1" }, { value: 4, color: "C2", label: "2" }]
        });
    });

    test("should NOT get active record (No selected)", () => {
        const store = getStore({ selected: null });

        expect(createRecordGetter(store)()).toBeNull();
    });
});
