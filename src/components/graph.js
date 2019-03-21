import { createGroup, createSVG } from "./common";
import getWidthController from "./widthController";

export class Graph {
    constructor(graph, frame, charts) {
        this.charts = [];

        this.graph = graph;
        this.frame = frame;
        this.chartGroup = charts;
    }

    addChart(chart) {
        this.charts.push(chart);
        chart.render(this.chartGroup);
    }

    setValues(data, positions) {
        this.charts.forEach((chart, i) => chart.change(data[i].values, positions, this.frame.getWidth()));
    }

    render(parent) {
        parent.appendChild(this.graph);
    }
}

export const getGraph = height => {
    const graph = createSVG(height);
    const charts = createGroup("chart");
    const frame = getWidthController(graph);

    graph.append(charts);

    return new Graph(graph, frame, charts);
};
