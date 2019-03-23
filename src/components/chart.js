import { createAnimation, createChart, createPoint } from "./common";
import { getCanvas } from "./canvas";
import { equal } from "../services/utils";

const OFF_SCREEN = "-100%";

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

        this.timer = setTimeout(() => this.chart.setAttributeNS(null, "points", yPoints), this.duration - 50); // 50ms - Making sure element is deleted on time

        this.values = values;
    }

    constructor(canvas, chart, state, point, ANIMATION_DURATION) {
        this.canvas = canvas;
        this.chart = chart; // Polyline
        this.state = state; // Animate

        // Previous Values (For mapping and setting points)
        this.values = null;
        this.positions = null;

        this.selected = point; // Point (For Selection)

        this.timer = null;

        this.duration = ANIMATION_DURATION;
    }

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

    select(at) {
        const pos = this.positions.indexOf(at);
        const { x, y } = this.canvas.mapPoint({ value: this.values[pos], at: this.positions[pos] });

        this.selected.setAttributeNS(null, "cx", x);
        this.selected.setAttributeNS(null, "cy", y);
    }

    unselect() {
        this.selected.setAttributeNS(null, "cx", OFF_SCREEN);
        this.selected.setAttributeNS(null, "cy", OFF_SCREEN);
    }

    render(target) {
        target.append(this.chart);
        target.append(this.selected);
    }
}

export const getChart = (ANIMATION_DURATION, HEIGHT, color) => {
    const line = createChart(color);
    const animate = createAnimation("points", ANIMATION_DURATION);
    const point = createPoint(color);

    line.appendChild(animate);

    const chart = new Chart(getCanvas(0, HEIGHT), line, animate, point, ANIMATION_DURATION);

    return chart;
};
