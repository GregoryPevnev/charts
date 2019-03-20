import { Graph } from "./graph";
import { HEIGHT } from "./values";
import { getLabels } from "./labels";
import { getScales } from "./scales";
import { getPopup, DETAIL_WIDTH } from "./details";
import { distinct } from "../services/utils";
import { createGroup, createSVG, createContainer, createPointer } from "./common";

// TODO: REFACTOR REALLY FUCKING GOOD - Especially Bounding-Rectangle
// TODO: Optimizations, Re-rendering, etc.

const LABELS_PER_SCREEN = 6;

class DynamicGraph extends Graph {
    notify(position, isMobile) {
        this.setPointer(position);
        this.listeners.forEach(l => l(position ? position / this.width : null, isMobile));
    }

    getRelation() {
        return Math.floor(this.width / this.cont.getBoundingClientRect().width);
    }

    getDetailPosition(at) {
        const EXTRA = 10;
        const pos = this.width * at;
        const relPos = pos - this.cont.scrollLeft;

        if (this.cont.getBoundingClientRect().width - relPos <= DETAIL_WIDTH) return pos - DETAIL_WIDTH - EXTRA; // Additonal offset for points themselves
        return pos + EXTRA / 2; // Additonal offset for points themselves
    }

    updateLabels() {
        // TODO: Move out to mapper if possible ??? OR Into Labels itself
        const RELATION = this.getRelation(),
            STEP = 100 / LABELS_PER_SCREEN / RELATION;

        const filtered = [];
        for (let i = 0; i <= 101; i += STEP) filtered.push(Math.floor(Math.min(i / 100, 1) * this.labelsCount));

        this.labels.setVisibility(this.width, distinct(filtered));
    }

    setPointer(x) {
        if (x !== null) {
            this.pointer.setAttributeNS(null, "x1", x);
            this.pointer.setAttributeNS(null, "x2", x);
        }
    }

    initialize() {
        this.cont.addEventListener("mousemove", e => this.notify(e.offsetX, false));

        this.cont.addEventListener("touchstart", e => {
            e.preventDefault(); // Prevents "mousemove" from firing

            const position = e.touches[0].clientX + this.cont.scrollLeft - this.cont.getBoundingClientRect().left;
            this.notify(position, true);
        });

        this.cont.addEventListener("mouseleave", () => {
            this.setPointer("-100%");
            this.notify(null);
        });
    }

    constructor(cont, graph, labels, scales, charts, points, popup, pointer) {
        super(graph, charts, points);

        this.cont = cont;
        this.labels = labels;
        this.scales = scales;
        this.width = 0;
        this.labelsCount = 0;
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
        this.labelsCount = dates.length - 1;
        this.labels.setDates(dates);
    }

    showScales(max) {
        this.scales.scale(max);
    }

    change(data, positions, width) {
        // TODO: Refactor anything rectangle / measures related
        this.width = this.cont.getBoundingClientRect().width / width;

        this.charts.forEach((chart, i) => chart.change(data[i].values, positions, this.width));
        this.graph.setAttributeNS(null, "width", this.width);
        this.updateLabels();
    }

    scroll(offset) {
        const by = this.width * offset;
        this.cont.scrollLeft = Math.floor(by);
        this.scales.move(by);
    }

    onSelection(listener) {
        this.listeners.push(listener);
    }

    render(parent) {
        parent.appendChild(this.cont);
    }
}

const filters = `<filter id="shadow"><feDropShadow dx="1" dy="2" stdDeviation="5" flood-color="#000" flood-opacity="0.2" /></filter>`;
const getDefs = () => {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = filters;
    return defs;
};

export const getDynamicGraph = () => {
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