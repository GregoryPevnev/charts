import { getSwitchButton } from "./components/switchBtn";
import loadData from "./store/loaders";
import initGraph from "./main";

const chartData = require("../chart_data.json");

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

    return initGraph(loadData(data), graph);
});

const render = () => stores.forEach(state => state.mutate());

switchBtn.render(app);

window.onresize = render;

render();
