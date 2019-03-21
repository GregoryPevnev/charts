import getState from "./state";
import {
    createRecordGetter,
    createDatesLoader,
    createMaxGetter,
    createRangeLoader,
    createFullLoader,
    createPositionsLoader
} from "./mappers";

export const MIN_SPAN = 12;

const initStore = data => {
    const store = getState({
        ...data,
        isNight: false,
        states: data.list.map(() => true),
        selected: null,
        from: 1 - MIN_SPAN / data.times.length, // Minimum span - 12days + Starting from the end
        to: 1
    });

    const getMax = createMaxGetter(store);

    store.mutate({ localMax: getMax(), globalMax: getMax({ from: 0, to: 1 }) });

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

export default initStore;
