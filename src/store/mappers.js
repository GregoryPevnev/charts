import { formatDate, formatFullDate } from "../services/dates";
import { toPercent } from "../services/scaling";

// Helpers

const getMaxFinder = store => {
    const cache = {};

    return (customState = {}) => {
        const { times, list, states, from, to } = { ...store.state(), ...customState };
        const max = times.length - 1;
        const currentFrom = from ? Math.round(from * max) : 0,
            currentTo = to ? Math.round(to * max) : max;

        const s = `${currentFrom}:::${currentTo}:::${states.join(",")}`;
        if (!cache[s])
            cache[s] = Math.max(
                0, // Default for no values at all
                ...list.map(({ values }, i) => (states[i] ? Math.max(...values.slice(currentFrom, currentTo + 1)) : 0))
            );
        return cache[s];
    };
};

const mapItems = (store, isGlobal) => () => {
    const { list, states, globalMax, localMax } = store.state();
    return list.map((item, i) => ({
        ...item,
        values: item.values.map(value => (states[i] ? value / (isGlobal ? globalMax : localMax) : -1))
    }));
};

// Mappers

export const createRecordGetter = store => () => {
    const { records, selected, times, states } = store.state();

    if (selected === null || !records[selected]) return null;

    const at = toPercent(selected, times[0], times[times.length - 1]);

    return { data: records[selected], at, title: formatFullDate(selected), states };
};

export const createMaxGetter = store => getMaxFinder(store);
export const createRangeLoader = store => mapItems(store, false);
export const createFullLoader = store => mapItems(store, true);
export const createDatesLoader = store => () => store.state().times.map(formatDate);
export const createPositionsLoader = store => () => store.state().positions;
