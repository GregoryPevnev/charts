import { createGroup, createSVG, createContainer } from "./common";
import { HEIGHT } from "./values";
import { getLabels } from "./labels";
import { getScales } from "./scales";

// TODO: Optimizations, Re-rendering, etc.

class Graph {
    constructor(graph, charts, points) {
        this.charts = [];
        this.points = [];

        this.graph = graph;
        this.width = window.innerWidth;
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

    setValues(data) {
        this.charts.forEach((chart, i) => chart.change(data[i], window.innerWidth));
    }

    render(parent) {
        parent.appendChild(this.graph);
    }
}

// Important: Does NOT differenciate between Points and Lines Charts -> TODO: Polymorphism
class DynamicGraph extends Graph {
    constructor(cont, graph, labels, scales, charts, points) {
        super(graph, charts, points);

        this.cont = cont;
        this.labels = labels;
        this.scales = scales;
        this.width = 0;
    }

    showLabels(dates) {
        this.labels.setDates(dates);
    }

    showScales(max) {
        this.scales.label(max);
    }

    change(data, width) {
        this.width = window.innerWidth / width;
        this.graph.setAttributeNS(null, "width", this.width);
        this.charts.forEach((chart, i) => chart.change(data[i], this.width));
    }

    scroll(offset) {
        const by = this.width * offset;
        this.cont.scrollLeft = by;
        this.scales.move(by);
    }

    render(parent) {
        parent.appendChild(this.cont);
    }
}

export const getGraph = () => {
    const cont = createContainer("container");
    const graph = createSVG(HEIGHT);
    const charts = createGroup("chart");
    const points = createGroup("points");

    const labels = getLabels();
    const scales = getScales();

    cont.append(graph);
    graph.append(charts);
    graph.append(points);

    labels.render(graph);
    scales.render(graph);

    return new DynamicGraph(cont, graph, labels, scales, charts, points);
};

export const getMiniGraph = height => {
    const graph = createSVG(height);
    const charts = createGroup("chart");
    const points = createGroup("points");

    graph.append(charts);
    graph.append(points);

    return new Graph(graph, charts, points);
};
