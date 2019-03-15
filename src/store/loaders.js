import { toPercent } from "../services/scaling";

export const mapColumns = ({ columns, types, colors, names }) => {
    return columns.reduce(
        (res, c, i) =>
            c[0] === "x"
                ? { ...res, times: c.slice(1) }
                : {
                      ...res,
                      columns: [...res.columns, c.slice(1)],
                      labels: [...res.labels.slice(0, i), names[c[0]], ...res.labels.slice(i + 1)],
                      types: [...res.types.slice(0, i), types[c[0]], ...res.types.slice(i + 1)],
                      colors: [...res.colors.slice(0, i), colors[c[0]], ...res.colors.slice(i + 1)]
                  },
        { times: [], columns: [], labels: [], types: [], colors: [] }
    );
};

export const getRecords = ({ columns, times, labels, colors }) =>
    times.reduce(
        (res, stamp, i) => ({
            ...res,
            [stamp]: columns.map((d, j) => ({ value: d[i], label: labels[j], color: colors[j] }))
        }),
        {}
    );

export const getTimes = times => times.slice().sort();

export const getList = ({ columns, times, labels, colors, types }) => {
    const values = times.reduce(
        (mapped, stamp, j) =>
            mapped.map((arr, i) => [
                ...arr,
                {
                    value: columns[i][j],
                    at: toPercent(stamp, times[0], times[times.length - 1])
                }
            ]),
        columns.map(() => []) // Pre-Compute arrays
    );

    return values.map((v, i) => ({ type: types[i], label: labels[i], color: colors[i], values: v }));
};

const loadData = state => {
    const data = mapColumns(state);

    return {
        times: getTimes(data.times),
        records: getRecords(data),
        list: getList(data)
    };
};

export default loadData;
