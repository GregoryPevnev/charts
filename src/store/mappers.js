import { formatDate, formatFullDate } from "../services/dates";

// TODO: Refactor some parts into services
const toPercent = (at, min, max) => (at - min) / (max - min);

export const createRecordGetter = store => {
    const cache = {};

    return () => {
        const {
            data: { results, labels, colors, times },
            selected
        } = store.state();

        if (selected === null) return null;

        if (!cache[selected]) {
            const data = results[selected].values.map((v, i) => ({
                value: v,
                label: labels[i],
                color: colors[i]
            }));
            const at = toPercent(selected, times[0], times[times.length - 1]);
            cache[selected] = { data, at, title: formatFullDate(selected) };
        }

        return cache[selected];
    };
};

export const createMaxGetter = store => {
    const cache = {};

    const sign = (from, to) => `${from}:::${to}`;

    return (myFrom = undefined, myTo = undefined) => {
        const {
            data: { results, times },
            from,
            to
        } = store.state();

        const curFrom = myFrom == undefined ? from : myFrom,
            curTo = myTo == undefined ? to : myTo;

        const s = sign(curFrom, curTo);
        if (!cache[s])
            cache[s] = times
                .slice(curFrom, curTo + 1) // INCLUDE FINAL ELEMENT
                .reduce((max, stamp) => Math.max(max, results[stamp].max), 0);
        return cache[s];
    };
};

// TODO: Refactor to use sub-funcitons instead of DI-Functions (Just separate certain logic)
export const createRangeGetter = (store, getMax) => (myFrom = undefined, myTo = undefined) => {
    const {
        data: { types, times, results },
        states
    } = store.state();
    // console.log(myFrom, myTo);
    const max = getMax(myFrom, myTo);

    return times.reduce(
        (mapped, stamp) =>
            mapped.map((arr, i) => [
                ...arr,
                {
                    value: results[stamp].values[i] / max + (states[i] ? 0 : 1),
                    at: toPercent(stamp, times[0], times[times.length - 1])
                }
            ]),
        types.map(() => []) // Pre-Compute arrays
    );
};

// TODO: Refactor + Caching / Pre-Computing
export const createLoadFull = (store, getRange) => () => {
    const {
        data: { times, colors }
    } = store.state();

    return getRange(0, times.length - 1).map((data, i) => ({ data, color: colors[i] }));
};

// TODO: Optimize + Cache + Save memory + Think about pre-computing data beforehand (ONLY performing data-mapping once for each operation) -> AFTER EVERYTHING IS DONE

export const createActiveGetter = store => () => {
    const { to, from, data } = store.state();
    return (to - from + 1) / data.times.length;
};

export const createOffsetGetter = store => () => {
    const { from, data } = store.state();
    return from / data.times.length;
};

export const createCheckerGetter = store => () => {
    const {
        data: { labels, colors },
        states
    } = store.state();

    return labels.map((label, i) => ({ label, color: colors[i], state: states[i] }));
};

const DAY_DIFF = 6;

export const createDatesLoader = store => () => {
    const {
        to,
        from,
        data: { times }
    } = store.state();

    const diff = Math.floor((from - to) / DAY_DIFF);
    return times.filter((_, i) => i % diff == 0).map(formatDate);
};
