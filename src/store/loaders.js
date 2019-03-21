import { toPercent } from "../services/scaling";

export const mapColumns = ({ columns, colors, names }) => {
    return columns.reduce(
        (res, c, i) =>
            c[0] === "x"
                ? { ...res, times: c.slice(1) }
                : {
                      ...res,
                      columns: [...res.columns, c.slice(1)],
                      labels: [...res.labels.slice(0, i), names[c[0]], ...res.labels.slice(i + 1)],
                      colors: [...res.colors.slice(0, i), colors[c[0]], ...res.colors.slice(i + 1)]
                  },
        { times: [], columns: [], labels: [], colors: [] }
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

export const getList = ({ columns, labels, colors }) =>
    columns.map((values, i) => ({ label: labels[i], color: colors[i], values }));

const loadData = state => {
    const data = mapColumns(state),
        times = data.times.slice().sort();

    return {
        times,
        records: getRecords(data),
        list: getList(data),
        positions: times.map(stamp => toPercent(stamp, times[0], times[times.length - 1]))
    };
};

export default loadData;
