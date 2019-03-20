import { getDynamicGraph } from "./components/dynamicGraph";
import { getChart } from "./components/chart";
import initStore, { MIN_GAP } from "./store";
import getController from "./components/control";
import { getChecks } from "./components/checks";
import { getRounder } from "./services/scaling";

const getRound = getRounder(0.2); // Optimal Gap

const initGraph = (data, target) => {
    // TODO: Actions and Generators
    const { store, loadRange, loadAll, getRecord, getMax, loadDates, loadPositions } = initStore(data);

    const all = loadAll();
    const graph = getDynamicGraph();
    const controller = getController(all);
    const scroller = controller.getScroller();
    const charts = all.map(({ color }) => getChart(color));
    const checks = getChecks(all);

    charts.forEach(chart => graph.addChart(chart));
    graph.showLabels(loadDates());

    store.listen(() => {
        const { from, to, states, localMax } = store.state();
        const record = getRecord(),
            positions = loadPositions();

        // TODO: Split into parts + Refactor SUPER-HEAVILY
        graph.change(loadRange(), positions, to - from); // Must be performed first (Setting Width)
        graph.scroll(from);
        graph.showScales(localMax);
        graph.showDetails(record);
        scroller.setWindow(from, to);
        checks.setStates(states);
        controller.setValues(loadAll(), positions);
    });

    scroller.onChange(range => {
        const currentState = store.state();

        if (range === null) return store.mutate({ localMax: getMax(currentState.from, currentState.to) });

        const { from, to } = range;
        const newFrom = from ? Math.max(0, from) : currentState.from,
            newTo = to ? Math.min(1, to) : currentState.to;

        if (newTo - newFrom > MIN_GAP) store.mutate({ from: newFrom, to: newTo });
    });

    scroller.onPosition(diff => {
        const { from, to } = store.state();
        const newFrom = from + diff,
            newTo = to + diff;

        if (newTo <= 1 && newFrom >= 0) store.mutate({ from: newFrom, to: newTo, localMax: getMax(newFrom, newTo) });
    });

    checks.onChange(i => {
        const { from, to, states } = store.state();
        const newStates = [...states.slice(0, i), !states[i], ...states.slice(i + 1)];

        store.mutate({ states: newStates });
        store.mutate({ localMax: getMax(from, to), globalMax: getMax() });
    });

    graph.onSelection((at, isMobile) => {
        const { times } = store.state();

        if (at === null) return store.mutate({ selected: null });

        // Differes depending on device
        // Mobile -> Show closest possible
        // Desktop -> Only if the point is close
        const selected = isMobile ? Math.round((times.length - 1) * at) : getRound((times.length - 1) * at);
        if (selected !== null) store.mutate({ selected: times[selected] });
    });

    graph.render(target);
    controller.render(target);
    checks.render(target);

    return store;
};

export default initGraph;
