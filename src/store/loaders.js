export const mapColumns = columns =>
    columns.reduce(
        (res, c) => (c[0] === "x" ? { ...res, times: c.slice(1) } : { ...res, columns: [...res.columns, c.slice(1)] }),
        { times: [], columns: [] }
    );

export const getResult = (columns, times) =>
    times.reduce(
        (res, stamp, i) => ({
            ...res,
            [stamp]: columns.map(d => d[i])
        }),
        {}
    );

const loadData = state => {
    const { times, columns } = mapColumns(state.columns);
    // const data = getData(state, columns);
    return {
        // ...data,
        times: times.sort(), // TODO: Compute Formatted Strings (+ Percentage OR try using indexing)
        records: getResult(columns, times)
    };
};

export default loadData;
