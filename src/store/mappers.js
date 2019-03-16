import { formatDate, formatFullDate } from "../services/dates";
import { toPercent } from "../services/scaling";

// Helpers

const getMaxFinder = () => {
    const cache = {};

    // TODO: Optimize later if needed
    return ({ times, list, from, to, states }) => {
        const max = times.length - 1;
        const currentFrom = Math.round(from * max),
            currentTo = Math.round(to * max);

        const s = `${currentFrom}:::${currentTo}:::${states.join(",")}`;
        if (!cache[s])
            cache[s] = Math.max(
                ...list
                    .filter((_, i) => states[i])
                    .map(({ values }) =>
                        Math.max(...values.slice(currentFrom, currentTo + 1).map(({ value }) => value))
                    )
            );
        return cache[s];
    };
};

const findMax = getMaxFinder();

const mapItems = state => {
    const { list, states } = state;
    const max = findMax(state);

    return list.map((item, i) => ({
        ...item,
        values: item.values.map(({ value, at }) => ({ at, value: states[i] ? value / max : -1 }))
    }));
};

// Mappers

export const createRecordGetter = store => () => {
    const { records, selected, times, states } = store.state();

    if (selected === null) return null;

    const at = toPercent(selected, times[0], times[times.length - 1]);
    // console.log("At", at);
    return { data: records[selected], at, title: formatFullDate(selected), states };
};

export const createMaxGetter = store => () => findMax(store.state());
export const createRangeLoader = store => () => mapItems(store.state());
export const createFullLoader = store => () => mapItems({ ...store.state(), from: 0, to: 1 });

export const createDatesLoader = store => () => store.state().times.map(formatDate);
