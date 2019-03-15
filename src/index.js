import { getGraph } from "./components/graph";
import { getChart } from "./components/chart";
import state, { loadRange, loadAll, getRecord, getMax, loadDates, MIN_GAP } from "./store";
import getController from "./components/control";
import { getChecks } from "./components/checks";
import { getSwitchButton } from "./components/nightBtn";

// TODO: Separate in the end (Main / DI / etc.)

const app = document.getElementById("app");

const all = loadAll();

const button = getSwitchButton();
const graph = getGraph();
const controller = getController(all);
const scroller = controller.getScroller();
const charts = all.map(({ color }) => getChart(color));
const checks = getChecks(all);
charts.forEach(chart => graph.addChart(chart));

state.listen(() => {
    const { from, to, isNight } = state.state();
    const record = getRecord();
    const max = getMax();

    graph.change(loadRange(), to - from);
    graph.scroll(from);
    graph.showScales(max);
    graph.showLabels(loadDates());
    graph.showDetails(record);
    scroller.setWindow(from, to);
    checks.setStates(state.state().states);
    button.switchMode(isNight);
    controller.setValues(loadAll());
});

scroller.onChange(({ from, to }) => {
    const currentState = state.state(); // Taking array-indexing into account

    // TODO: Constants for percentage
    const newFrom = from ? Math.max(0, from) : currentState.from,
        newTo = to ? Math.min(1, to) : currentState.to;

    if (newTo - newFrom > MIN_GAP) state.mutate({ from: newFrom, to: newTo });
});

scroller.onPosition(diff => {
    const { from, to } = state.state();
    const newFrom = from + diff,
        newTo = to + diff;

    if (newTo <= 1 && newFrom >= 0) state.mutate({ from: newFrom, to: newTo });
});

checks.onChange(i => {
    const states = state.state().states;
    const newStates = [...states.slice(0, i), !states[i], ...states.slice(i + 1)];
    state.mutate({ states: newStates });
});

graph.onSelection(at => {
    const { times } = state.state();

    const selected = at ? times[Math.max(0, Math.round(times.length * at) - 1)] : null;

    state.mutate({ selected });
});

button.onSwitch(() => state.mutate({ isNight: !state.state().isNight }));

graph.render(app);
controller.render(app);
checks.render(app);

state.mutate();

window.onresize = () => state.mutate();
