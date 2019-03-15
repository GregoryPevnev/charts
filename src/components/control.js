import { createContainer } from "./common";
import { getMiniGraph } from "./graph";
import { getScroller } from "./scroller";
import { getChart } from "./chart";

class Controller {
    constructor(bar, scroller, graph) {
        this.bar = bar;
        this.scroller = scroller;
        this.graph = graph;
    }

    getScroller() {
        return this.scroller;
    }

    setValues(data) {
        // TODO: Optimize re-rendering
        this.graph.setValues(data.map(d => d.values));
    }

    render(parent) {
        parent.append(this.bar);
    }
}

const getController = data => {
    const bar = createContainer("bar");
    const graph = getMiniGraph(50);
    const scroller = getScroller();

    data.forEach(({ color }) => graph.addChart(getChart(color, 50)));

    graph.render(bar);
    scroller.render(bar);

    return new Controller(bar, scroller, graph);
};

export default getController;
