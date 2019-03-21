import { Graph } from "./graph";
import { HEIGHT } from "./values";
import { createGroup, createSVG, createContainer, createPointer } from "./common";
import getFilterBuilder from "./filters";

class DynamicGraph extends Graph {
    notify(position, isMobile = false) {
        const pos = position / this.frame.getWidth();
        this.setPointer(position);
        this.selectionListeners.forEach(l => l(pos, isMobile));
    }

    setPointer(x) {
        this.pointer.setAttributeNS(null, "x1", x);
        this.pointer.setAttributeNS(null, "x2", x);
    }

    hidePointer() {
        this.setPointer("-100%");
        this.deselectionListeners.forEach(l => l());
    }

    initialize() {
        this.graph.addEventListener("mousemove", e => this.notify(e.offsetX, false));

        this.graph.addEventListener("touchstart", e => {
            e.preventDefault(); // Prevents "mousemove" from firing

            const position = e.touches[0].clientX + this.frame.getOffset();
            this.notify(position, true);
        });

        this.graph.addEventListener("mouseleave", this.hidePointer.bind(this));
    }

    constructor(cont, graph, frame, labels, scales, charts, popup, pointer) {
        super(cont, frame, charts);

        this.svg = graph; // TODO: Remove if possible / generalization
        this.labels = labels;
        this.scales = scales;
        this.popup = popup;
        this.pointer = pointer;

        this.selectionListeners = [];
        this.deselectionListeners = [];

        this.initialize();
    }

    showDetails({ at, title, data, states }) {
        const labels = data.filter((_, i) => states[i]);
        const { position, relativePosition } = this.frame.getRelativePosition(at);

        this.popup.show(position, relativePosition, labels.length);
        this.popup.setData(title, labels);
        this.charts.forEach(chart => chart.setSelected(at));
    }

    hideDetails() {
        this.setPointer("-100%");
        this.popup.hide();
        this.charts.forEach(chart => chart.setSelected(null));
    }

    setValues(data, positions) {
        // TODO: Final - Optimizations
        super.setValues(data, positions);
        this.svg.setAttributeNS(null, "width", this.frame.getWidth());
        this.labels.setVisibility(this.frame.getVisibleWidth(), this.frame.getWidth());
    }

    scroll(offset) {
        const by = this.frame.getWidth() * offset;
        this.graph.scrollLeft = Math.floor(by);
        this.scales.move(by);
    }

    subscribe(select, deselect) {
        this.selectionListeners.push(select);
        this.deselectionListeners.push(deselect);
    }
}

export const getDynamicGraph = (frame, labels, scales, popup) => {
    const cont = createContainer("container");
    const graph = createSVG(HEIGHT);
    const charts = createGroup("chart");
    const pointer = createPointer();
    const shadowFilter = getFilterBuilder()
        .addShadowFilter("shadow")
        .getDefinition();

    cont.append(graph);
    graph.append(charts);
    graph.append(shadowFilter);
    graph.append(pointer);

    labels.render(graph);
    popup.render(graph);
    scales.render(graph);
    frame.bind(cont);

    return new DynamicGraph(cont, graph, frame, labels, scales, charts, popup, pointer);
};
