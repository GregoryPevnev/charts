import { formatDate, formatFullDate } from "../services/dates";
import { toPercent } from "../services/scaling";

// TODO: Optimize + Cache + Save memory + Think about pre-computing data beforehand (ONLY performing data-mapping once for each operation) -> AFTER EVERYTHING IS DONE

const getMaxFinder = () => {
    const cache = {};

    return (list, from, to, states) => {
        const s = `${from}:::${to}:::${states.join(",")}`;
        if (!cache[s])
            cache[s] = Math.max(
                ...list
                    .filter((_, i) => states[i])
                    .map(({ values }) => Math.max(...values.slice(from, to + 1).map(({ value }) => value)))
            );
        return cache[s];
    };
};

const getRange = ({ myFrom, myTo }, { times, from, to }) => {
    const currentFrom = myFrom == undefined ? from : myFrom,
        currentTo = myTo == undefined ? to : myTo;
    const max = times.length - 1;

    return { from: Math.round(currentFrom * max), to: Math.round(currentTo * max) };
};

const findMax = getMaxFinder();

export const createRecordGetter = store => () => {
    const { records, selected, times } = store.state();

    if (selected === null) return null;

    const at = toPercent(selected, times[0], times[times.length - 1]);
    return { data: records[selected], at, title: formatFullDate(selected) };
};

// TODO: Refactor defaults (With Use-Cases in application) -> Embed max into response if possible
// TODO: Create a separate method for Full-List if needed
export const createMaxGetter = store => (myFrom = undefined, myTo = undefined) => {
    const state = store.state();
    const { from, to } = getRange({ myFrom, myTo }, state);

    return findMax(state.list, from, to, state.states);
};

export const createRangeLoader = store => (myFrom = undefined, myTo = undefined) => {
    const { list, states } = store.state();
    const { from, to } = getRange({ myFrom, myTo }, store.state());

    const max = findMax(list, from, to, states);

    return list.map((item, i) => ({
        ...item,
        // TODO: Refactor
        values: item.values.map(({ value, at }) => ({ at, value: states[i] ? value / max : 1.5 })) // 150% -> Invisible
        // TODO: Refactor invisible if needed (property / not shown / etc.)
    }));
};

const DAY_DIFF = 6;
export const createDatesLoader = store => () => {
    const { to, from, times } = store.state();

    const diff = Math.floor(((to - from) * times.length) / DAY_DIFF);
    return times.filter((_, i) => i % diff == 0).map(formatDate);
};
