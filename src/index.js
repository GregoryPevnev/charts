import { getGraph } from "./components/graph";
import { getChart } from "./components/chart";
import state, { getRange, getActive, getOffset, getRecord, getMax } from "./store";
import { loadDates, loadFull } from "./store";
import getController from "./components/control";
import { getChecks } from "./components/checks";
import { getCheckers } from "./store";

// TODO: This whole mess needs refactoring

let isNight = true; // TODO: Definately refactor / Separate

const app = document.getElementById("app");
const page = document.querySelector("body");
const button = document.querySelector(".btn");

const graph = getGraph();
const controller = getController(loadFull());
const scroller = controller.getScroller();
const charts = state.state().data.types.map((_, i) => getChart(state.state().data.colors[i]));
const checks = getChecks(getCheckers());
charts.forEach(chart => graph.addChart(chart));

state.listen(() => {
    const active = getActive(),
        offset = getOffset();

    graph.change(getRange(), active);
    graph.scroll(offset);
    graph.showScales(getMax());
    graph.showLabels(loadDates());
    scroller.setWindow(offset, offset + active);
    checks.setStates(getCheckers().map(({ state }) => state));
    controller.setValues(loadFull());
});

scroller.onChange(({ from, to }) => {
    const currentState = state.state(); // Taking array-indexing into account
    const size = currentState.data.times.length - 1;

    const newFrom = from ? Math.max(0, size * from) : currentState.from,
        newTo = to ? Math.min(size, size * to) : currentState.to;

    if (newTo - newFrom >= 6) state.mutate({ from: newFrom, to: newTo });
});

// TODO: Global Refactoring - Replace "from" and "to" with percentage (Translate to indexes)
scroller.onPosition(diff => {
    const {
        data: { times },
        from,
        to
    } = state.state();
    const indexDiff = times.length * diff;
    const newFrom = from + indexDiff,
        newTo = to + indexDiff;

    if (newTo <= times.length - 1 && newFrom >= 0 && newTo - newFrom >= 6) state.mutate({ from: newFrom, to: newTo });
});

checks.onChange(i => {
    const states = state.state().states;
    const newStates = [...states.slice(0, i), !states[i], ...states.slice(i + 1)];
    state.mutate({ states: newStates });
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
