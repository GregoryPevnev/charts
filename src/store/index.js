import getState from "./state";
import {
    createRecordGetter,
    createDatesLoader,
    createMaxGetter,
    createRangeLoader,
    createFullLoader,
    createPositionsLoader
} from "./mappers";

// 10%
export const MIN_GAP = 0.1; // TODO: Make dynamic

const initStore = data => {
    const store = getState({
        ...data,
        isNight: false,
        states: data.list.map(() => true),
        selected: null,
        from: 1 - MIN_GAP, // Minimum gap - 12days + Starting from the end
        to: 1
    });

    const getMax = createMaxGetter(store);

    store.mutate({ localMax: getMax(1 - MIN_GAP, 1), globalMax: getMax() });

    return {
        store,
        getMax,
        getRecord: createRecordGetter(store),
        loadDates: createDatesLoader(store),
        loadRange: createRangeLoader(store),
        loadAll: createFullLoader(store),
        loadPositions: createPositionsLoader(store)
    };
};

// TODO: Initialize with / Separate

export default initStore;
