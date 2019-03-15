import { getGraph } from "./components/graph";
import { getChart } from "./components/chart";
import state, { loadItems, getRecord, getMax, loadDates, MIN_GAP } from "./store";
import getController from "./components/control";
import { getChecks } from "./components/checks";

// TODO: This whole mess needs refactoring

let isNight = true; // TODO: REPLACE WITH STATE

const app = document.getElementById("app");
const page = document.querySelector("body");
const button = document.querySelector(".btn");

const graph = getGraph();
const controller = getController(state.state().list);
const scroller = controller.getScroller();
const charts = state.state().list.map(({ color }) => getChart(color));
const checks = getChecks(state.state().list);
charts.forEach(chart => graph.addChart(chart));

state.listen(() => {
    const { from, to } = state.state();
    const record = getRecord();
    const max = getMax();

    graph.change(loadItems(), to - from);
    graph.scroll(from);
    graph.showScales(max);
    graph.showLabels(loadDates());
    graph.showDetails(record);
    scroller.setWindow(from, to);
    checks.setStates(state.state().states);

    // TODO: Think about refactoring into a standalon metyhod for better querying
    controller.setValues(loadItems(0, state.state().list.length));
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

    const selected = at ? times[Math.floor(times.length * at)] : null;

    state.mutate({ selected });
});

// TODO: Separate
const switchMode = () => {
    isNight = !isNight;
    if (isNight) {
        page.classList.add("night");
        button.textContent = "Switch to Day Mode";
    } else {
        page.classList.remove("night");
        button.textContent = "Switch to Night Mode";
    }
};
button.addEventListener("click", switchMode);

graph.render(app);
controller.render(app);
checks.render(app);

state.mutate();

switchMode();
