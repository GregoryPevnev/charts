import { createAnimation, createChart, mapPoints } from "./common";
import { HEIGHT } from "./values";

class Chart {
    mapPoints(marks) {
        return mapPoints(marks, this.WIDTH, this.HEIGHT);
    }

    transition(oldPoints, newPoints) {
        if (newPoints === oldPoints) return;

        this.state.setAttributeNS(null, "from", oldPoints);
        this.state.setAttributeNS(null, "to", newPoints);
        this.state.beginElement();
        setTimeout(() => this.chart.setAttributeNS(null, "points", newPoints), 150);
    }

    constructor(HEIGHT, chart, state) {
        this.WIDTH = 0;
        this.HEIGHT = HEIGHT;
        this.chart = chart; // Polyline
        this.state = state; // Animate
        this.values = null; // Previous Values
    }

    change(values, width) {
        if (this.values === null || this.WIDTH !== width) {
            this.WIDTH = width;
            this.chart.setAttributeNS(null, "points", this.mapPoints(values));
        } else this.transition(this.mapPoints(this.values), this.mapPoints(values));

        this.values = values;
        // Note: Rising from the bottom does not work
    }

    render(target) {
        target.appendChild(this.chart);
    }
}

export const getChart = (color, height = undefined) => {
    const line = createChart(color);
    const animate = createAnimation("points");
    line.appendChild(animate);

    const chart = new Chart(height || HEIGHT, line, animate);

    return chart;
};
