import { getDynamicGraph } from "./components/dynamicGraph";
import { getChart } from "./components/chart";
import initStore, { MIN_SPAN } from "./store";
import getBar from "./components/bar";
import { getChecks } from "./components/checks";
import { getRounder } from "./services/scaling";
import { getLabels } from "./components/labels";
import { getScales } from "./components/scales";
import { getPopup } from "./components/details";
import getWidthController from "./components/widthController";

const getRound = getRounder(0.18); // Optimal Span

const initGraph = (data, target, { GRAPH_SIZE, MINI_GRAPH_SIZE, ANIMATION_DURATION }) => {
    const { store, loadRange, loadAll, getRecord, getMax, loadDates, loadPositions } = initStore(data);

    const frame = getWidthController();
    const labels = getLabels(GRAPH_SIZE);
    const scales = getScales(GRAPH_SIZE);
    const popup = getPopup();
    const graph = getDynamicGraph(GRAPH_SIZE, frame, labels, scales, popup);

    const all = loadAll();
    const bar = getBar(ANIMATION_DURATION, MINI_GRAPH_SIZE, all);
    const charts = all.map(({ color }) => getChart(ANIMATION_DURATION, GRAPH_SIZE, color));
    const checks = getChecks(all);

    store.listen(() => {
        const { from, to, states, localMax } = store.state();
        const record = getRecord(),
            positions = loadPositions();

        frame.setRelation(to - from); // Must be performed first (Setting Width)
        graph.setValues(loadRange(), positions);
        graph.scroll(from);
        bar.setWindow(from, to);
        scales.scale(localMax);
        checks.setStates(states);
        bar.setValues(loadAll(), positions);

        if (record) graph.showDetails(record);
        else graph.hideDetails();
    });

    bar.subscribe(
        range => {
            const { from, to } = range,
                currentState = store.state();
            const newFrom = from ? Math.max(0, from) : currentState.from,
                newTo = to ? Math.min(1, to) : currentState.to;
            const currentGap = (newTo - newFrom) * currentState.times.length;

            if (currentGap > MIN_SPAN) store.mutate({ from: newFrom, to: newTo, selected: null });
        },
        () => {
            const { from, to } = store.state();
            store.mutate({ localMax: getMax(from, to) });
        },
        diff => {
            const { from, to } = store.state();
            const newFrom = from + diff,
                newTo = to + diff;

            if (newTo <= 1 && newFrom >= 0)
                store.mutate({ from: newFrom, to: newTo, localMax: getMax(newFrom, newTo), selected: null });
        }
    );

    checks.onChange(i => {
        const { states } = store.state();
        const newStates = [...states.slice(0, i), !states[i], ...states.slice(i + 1)];

        store.mutate({
            localMax: getMax({ states: newStates }),
            globalMax: getMax({ states: newStates, from: 0, to: 1 }),
            states: newStates
        });
    });

    graph.subscribe(
        (at, isMobile) => {
            const { times } = store.state();

            // Differes depending on device
            // Mobile -> Show closest possible
            // Desktop -> Only if the point is close
            const selected = isMobile ? Math.round((times.length - 1) * at) : getRound((times.length - 1) * at);
            if (selected !== null) store.mutate({ selected: times[selected] });
        },
        () => store.mutate({ selected: null })
    );

    graph.render(target);
    bar.render(target);
    checks.render(target);

    charts.forEach(chart => graph.addChart(chart));
    labels.setDates(loadDates());

    return store;
};

export default initGraph;
