import { createAnimation, createChart, createPoint } from "./common";
import { HEIGHT } from "./values";
import { getCanvas } from "./canvas";
import { equal } from "../services/utils";

class Chart {
    getPoints({ values, positions } = {}) {
        const vals = values || this.values,
            pos = positions || this.positions;
        return this.canvas.mapPoints(vals.map((value, i) => ({ value, at: pos[i] })));
    }

    transition(positions, values) {
        // Case 1: Only Width has changed -> Simply setting

        if (equal(values, this.values)) {
            if (this.timer !== null) clearTimeout(this.timer);
            this.chart.setAttributeNS(null, "points", this.getPoints({ positions }));
            return;
        }

        // Case 2: Values have changed -> Animating

        const xPoints = this.getPoints({ positions }),
            yPoints = this.getPoints({ positions, values });

        // Setting X
        this.chart.setAttributeNS(null, "points", xPoints);

        // Animating Y
        this.state.setAttributeNS(null, "from", xPoints);
        this.state.setAttributeNS(null, "to", yPoints);
        this.state.beginElement();

        this.timer = setTimeout(() => this.chart.setAttributeNS(null, "points", yPoints), 250); // 250ms - Perfect for 300ms animation

        this.values = values;
    }

    constructor(HEIGHT, chart, state, point) {
        this.canvas = getCanvas(0, HEIGHT);
        this.chart = chart; // Polyline
        this.state = state; // Animate

        // Previous Values (For mapping and setting points)
        this.values = null;
        this.positions = null;

        this.selected = point; // Point (For Selection)

        this.timer = null;
    }

    // TODO: Cache positions - never change
    change(values, positions, width) {
        this.canvas.setWidth(width);

        if (this.values === null && this.positions === null) {
            this.values = values;
            this.chart.setAttributeNS(null, "points", this.getPoints({ positions }));
        } else {
            this.transition(positions, values);
        }

        this.positions = positions;
    }

    setSelected(at) {
        if (at) {
            const pos = this.positions.indexOf(at);
            const { x, y } = this.canvas.mapPoint({ value: this.values[pos], at: this.positions[pos] });

            this.selected.setAttributeNS(null, "cx", x);
            this.selected.setAttributeNS(null, "cy", y);
        } else {
            this.selected.setAttributeNS(null, "cx", "-100%"); // TODO: Make a static value
            this.selected.setAttributeNS(null, "cy", "-100%");
        }
    }

    render(target) {
        target.append(this.chart);
        target.append(this.selected);
    }
}

export const getChart = (color, height = undefined) => {
    const line = createChart(color);
    const animate = createAnimation("points");
    const point = createPoint(color);

    line.appendChild(animate);

    const chart = new Chart(height || HEIGHT, line, animate, point);

    return chart;
};
