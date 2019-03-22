import { getSwitchButton } from "./components/switchBtn";
import loadData from "./store/loaders";
import initGraph from "./main";

const chartData = require("../chart_data.json");

const GRAPH_SIZE = 400;
const MINI_GRAPH_SIZE = 50;
const ANIMATION_DURATION = 300;

const app = document.getElementById("app");
const switchBtn = getSwitchButton();

let isNight = false;
switchBtn.onSwitch(() => {
    isNight = !isNight;
    switchBtn.switchMode(isNight);
});

const stores = chartData.map((data, i) => {
    const graph = document.createElement("div");
    graph.className = "graph";

    const header = document.createElement("h1");
    header.textContent = "Chart " + (i + 1);

    graph.append(header);
    app.append(graph);

    return initGraph(loadData(data), graph, { GRAPH_SIZE, MINI_GRAPH_SIZE, ANIMATION_DURATION });
});

const render = () => stores.forEach(state => state.mutate());

window.onresize = render;

render();
switchBtn.render(app);
