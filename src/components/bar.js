import { createContainer } from "./common";
import { getGraph } from "./graph";
import { getScroller } from "./scroller";
import { getChart } from "./chart";

class Bar {
    constructor(bar, scroller, graph) {
        this.bar = bar;
        this.scroller = scroller;
        this.graph = graph;
    }

    setValues(data, positions) {
        // TODO: Optimize re-rendering
        // TODO: Pass positions only ONCE
        this.graph.setValues(data, positions);
    }

    setWindow(from, to) {
        this.scroller.setWindow(from, to - from);
    }

    render(parent) {
        parent.append(this.bar);
    }

    subscribe(change, frame, position) {
        this.scroller.onPosition(position);
        this.scroller.onFrame(frame);
        this.scroller.onChange(change);
    }
}

const getBar = data => {
    const bar = createContainer("bar");
    // TODO: DI + Width as a Magic-Value
    const graph = getGraph(50);
    const scroller = getScroller();

    data.forEach(({ color }) => graph.addChart(getChart(color, 50)));

    graph.render(bar);
    scroller.render(bar);

    return new Bar(bar, scroller, graph);
};

export default getBar;
