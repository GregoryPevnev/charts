import { createGroup, createSVG, createContainer, createPointer } from "./common";
import { HEIGHT } from "./values";
import { getLabels } from "./labels";
import { getScales } from "./scales";
import { getPopup, DETAIL_WIDTH } from "./details";
import { distinct } from "../services/utils";

// TODO: Optimizations, Re-rendering, etc.
// TODO: Separate into multiple files if possible (Maybe Super-Graph and Sub-Graph)

const LABELS_PER_SCREEN = 6;

class Graph {
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

    setValues(data) {
        this.charts.forEach((chart, i) => chart.change(data[i], this.getVisibleWidth()));
    }

    render(parent) {
        parent.appendChild(this.graph);
    }
}

class DynamicGraph extends Graph {
    notify(value) {
        this.listeners.forEach(l => l(value));
    }

    getRelation() {
        return Math.floor(this.width / this.cont.getBoundingClientRect().width);
    }

    getDetailPosition(at) {
        const UNIT = DETAIL_WIDTH / 2;
        const pos = this.width * at;
        const relPos = pos - this.cont.scrollLeft;

        if (relPos <= UNIT) return pos;
        if (this.cont.getBoundingClientRect().width - relPos <= UNIT) return pos - DETAIL_WIDTH;
        return pos - UNIT;
    }

    setPointer(x) {
        this.pointer.setAttributeNS(null, "x1", x);
        this.pointer.setAttributeNS(null, "x2", x);
    }

    initialize() {
        this.cont.addEventListener("mousemove", e => {
            const position = e.offsetX;
            this.setPointer(position);
            this.notify(position / this.width);
        });

        this.cont.addEventListener("mouseleave", () => {
            this.setPointer(-10);
            this.notify(null);
        });
    }

    constructor(cont, graph, labels, scales, charts, points, popup, pointer) {
        super(graph, charts, points);

        this.cont = cont;
        this.labels = labels;
        this.scales = scales;
        this.width = 0;
        this.popup = popup;
        this.pointer = pointer;
        this.listeners = [];

        this.initialize();
    }

    showDetails(record) {
        if (record) {
            const { at, title, data, states } = record;
            this.popup.setData(this.getDetailPosition(at), title, data.filter((_, i) => states[i]));
            this.charts.forEach(chart => chart.setSelected(at));
        } else {
            this.popup.hide();
            this.charts.forEach(chart => chart.setSelected(null));
        }
    }

    showLabels(dates) {
        const RELATION = this.getRelation(),
            TOP = dates.length - 1;
        const STEP = 100 / LABELS_PER_SCREEN / RELATION;

        const filtered = [];
        for (let i = 0; i <= 101; i += STEP) filtered.push(dates[Math.ceil(Math.min(i / 100, 1) * TOP)]);

        this.labels.setDates(this.width, distinct(filtered));
    }

    showScales(max) {
        this.scales.label(max);
    }

    change(data, width) {
        this.width = this.cont.getBoundingClientRect().width / width;
        this.graph.setAttributeNS(null, "width", this.width);
        this.charts.forEach((chart, i) => chart.change(data[i].values, this.width));
    }

    scroll(offset) {
        const by = this.width * offset;
        this.cont.scrollLeft = by;
        this.scales.move(by);
    }

    onSelection(listener) {
        this.listeners.push(listener);
    }

    render(parent) {
        parent.appendChild(this.cont);
    }
}

const filters = `<filter id="shadow"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.2" /></filter>`;
const getDefs = () => {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = filters;
    return defs;
};

export const getGraph = () => {
    const cont = createContainer("container");
    const graph = createSVG(HEIGHT);
    const charts = createGroup("chart");
    const points = createGroup("points");
    const pointer = createPointer();

    const labels = getLabels();
    const scales = getScales();
    const popup = getPopup();

    cont.append(graph);
    graph.append(charts);
    graph.append(points);
    graph.append(getDefs());
    graph.append(pointer);

    labels.render(graph);
    popup.render(graph);
    scales.render(graph);

    return new DynamicGraph(cont, graph, labels, scales, charts, points, popup, pointer);
};

export const getMiniGraph = height => {
    const graph = createSVG(height);
    const charts = createGroup("chart");
    const points = createGroup("points");

    graph.append(charts);
    graph.append(points);

    return new Graph(graph, charts, points);
};
