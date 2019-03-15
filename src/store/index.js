import getState from "./state";
import loadData from "./loader";
import {
    createRecordGetter,
    createRangeGetter,
    createOffsetGetter,
    createActiveGetter,
    createDatesLoader,
    createMaxGetter,
    createLoadFull,
    createCheckerGetter
} from "./mappers";

const MIN_GAP = 12; // TODO: DI

const data = loadData(require("../../chart_data.json")[4]);

const store = getState({
    data,
    isNight: false,
    states: data.types.map(() => true),
    selected: null,
    from: data.times.length - 1 - MIN_GAP, // Minimum gap - 12days + Starting from the end
    to: data.times.length - 1
});

export const getRecord = createRecordGetter(store);
export const getMax = createMaxGetter(store);
export const getRange = createRangeGetter(store, getMax);
export const getOffset = createOffsetGetter(store);
export const getActive = createActiveGetter(store);
export const loadDates = createDatesLoader(store);
export const loadFull = createLoadFull(store, getRange);
export const getCheckers = createCheckerGetter(store);

export default store;
