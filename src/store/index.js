import getState from "./state";
import loadData from "./loaders";
import { createRecordGetter, createDatesLoader, createMaxGetter, createRangeLoader, createFullLoader } from "./mappers";

// 5%
export const MIN_GAP = 0.05; // TODO: DI

const data = loadData(require("../../chart_data.json")[0]);

const store = getState({
    ...data,
    isNight: false,
    states: data.list.map(() => true),
    selected: null,
    from: 1 - MIN_GAP, // Minimum gap - 12days + Starting from the end
    to: 1
});

export const getRecord = createRecordGetter(store);
export const getMax = createMaxGetter(store);
export const loadDates = createDatesLoader(store);
export const loadRange = createRangeLoader(store);
export const loadAll = createFullLoader(store);

export default store;
