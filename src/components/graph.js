import { createGroup, createSVG } from "./common";

export class Graph {
    getVisibleWidth() {
        return this.graph.getBoundingClientRect().width;
    }

    constructor(graph, charts, points) {
        this.charts = [];
        this.points = [];

        this.graph = graph;
        this.width = this.getVisibleWidth();
        this.chartGroup = charts;
        this.pointsGroup = points;
    }

    addChart(chart) {
        this.charts.push(chart);
        chart.render(this.chartGroup);
    }

    addPoints(points) {
        this.charts.push(points);
        points.render(this.pointsGroup);
    }

    setValues(data, positions) {
        this.charts.forEach((chart, i) => chart.change(data[i], positions, this.getVisibleWidth()));
    }

    render(parent) {
        parent.appendChild(this.graph);
    }
}

export const getGraph = height => {
    const graph = createSVG(height);
    const charts = createGroup("chart");
    const points = createGroup("points");

    graph.append(charts);
    graph.append(points);

    return new Graph(graph, charts, points);
};
