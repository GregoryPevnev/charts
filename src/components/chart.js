import { createAnimation, createChart, createPoint } from "./common";
import { HEIGHT } from "./values";
import { getCanvas } from "./canvas";

class Chart {
    transition(oldPoints, newPoints) {
        if (newPoints === oldPoints) return;

        this.state.setAttributeNS(null, "from", oldPoints);
        this.state.setAttributeNS(null, "to", newPoints);
        this.state.beginElement();
        setTimeout(() => this.chart.setAttributeNS(null, "points", newPoints), 150);
    }

    constructor(HEIGHT, chart, state, point) {
        this.canvas = getCanvas(0, HEIGHT);
        this.chart = chart; // Polyline
        this.state = state; // Animate
        this.values = null; // Previous Values
        this.selected = point; // Point (For Selection)
    }

    change(values, width) {
        if (this.values === null || this.canvas.width !== width) {
            this.canvas.width = width;
            this.chart.setAttributeNS(null, "points", this.canvas.mapPoints(values));
        } else this.transition(this.canvas.mapPoints(this.values), this.canvas.mapPoints(values));

        this.values = values;
        // Note: Rising from the bottom does not work
    }

    setSelected(at) {
        if (at) {
            const pos = this.values.find(v => v.at === at);
            const { x, y } = this.canvas.mapPoint(pos);

            this.selected.setAttributeNS(null, "cx", x);
            this.selected.setAttributeNS(null, "cy", y);
        } else {
            this.selected.setAttributeNS(null, "cx", -5);
            this.selected.setAttributeNS(null, "cy", -5);
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
