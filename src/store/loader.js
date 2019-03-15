// Actual Production code
const mapColumns = columns =>
    columns.reduce(
        (res, c) => {
            if (c[0] === "x") return { ...res, times: c.slice(1) };
            return { ...res, columns: [...res.columns, c] };
        },
        { times: [], columns: [] }
    );

const getData = (state, columns) =>
    columns.reduce(
        ({ labels, colors, types }, c) => ({
            labels: [...labels, state.names[c[0]]],
            colors: [...colors, state.colors[c[0]]],
            types: [...types, state.types[c[0]]]
        }),
        {
            // TODO: Think about grouping into "info" for better access
            labels: [],
            colors: [],
            types: []
        }
    );

const getResult = (data, times) =>
    times.reduce((res, stamp, i) => {
        const values = data.map(d => d[i + 1]);
        return {
            ...res,
            [stamp]: {
                values,
                max: Math.max(...values)
                // Important: min is always 0 -> no need to store
            }
        };
    }, {});

const loadData = state => {
    const { times, columns } = mapColumns(state.columns);
    const data = getData(state, columns);
    return {
        ...data,
        times: times.sort(),
        results: getResult(columns, times)
    };
};

export default loadData;
