export const data = {
    columns: [["x", 843253454535, 543253454535], ["y1", 1, 2], ["y2", 3, 4]],
    names: {
        y1: "1",
        y2: "2"
    },
    colors: {
        y2: "C2",
        y1: "C1"
    },
    types: {
        y2: "T2",
        y1: "T1"
    }
};

export const getStore = data => ({
    state() {
        return {
            list: [
                {
                    color: "C1",
                    type: "T1",
                    label: "1",
                    values: [{ value: 1, at: 0 }, { value: 2, at: 1 }, { value: 5, at: 3 }, { value: 7, at: 4 }]
                },
                {
                    color: "C2",
                    type: "T2",
                    label: "2",
                    values: [{ value: 3, at: 0 }, { value: 4, at: 1 }, { value: 6, at: 3 }, { value: 8, at: 4 }]
                }
            ],
            records: {
                0: [{ value: 1, color: "C1", label: "1" }, { value: 3, color: "C2", label: "2" }],
                1: [{ value: 2, color: "C1", label: "1" }, { value: 4, color: "C2", label: "2" }],
                3: [{ value: 5, color: "C1", label: "1" }, { value: 6, color: "C2", label: "2" }],
                4: [{ value: 7, color: "C1", label: "1" }, { value: 8, color: "C2", label: "2" }]
            },
            times: [0, 1, 3, 4],
            ...data
        };
    }
});
