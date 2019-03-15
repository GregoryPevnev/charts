import { createAnimation, createChart, createPoint } from "./common";
import { HEIGHT } from "./values";

class Chart {
    mapPoint({ value, at }) {
        return {
            x: this.WIDTH * at,
            y: this.HEIGHT * (value === -1 ? -0.5 : 1 - value) // -50% -> Off-screen
        };
    }

    mapPoints(marks) {
        return Array.from(marks)
            .map(v => {
                const { x, y } = this.mapPoint(v);
                return `${x} ${y}`;
            })
            .join(",");
    }

    transition(oldPoints, newPoints) {
        if (newPoints === oldPoints) return;

        this.state.setAttributeNS(null, "from", oldPoints);
        this.state.setAttributeNS(null, "to", newPoints);
        this.state.beginElement();
        setTimeout(() => this.chart.setAttributeNS(null, "points", newPoints), 150);
    }

    constructor(HEIGHT, chart, state, point) {
        this.WIDTH = 0;
        this.HEIGHT = HEIGHT;
        this.chart = chart; // Polyline
        this.state = state; // Animate
        this.values = null; // Previous Values
        this.selected = point; // Point
    }

    change(values, width) {
        if (this.values === null || this.WIDTH !== width) {
            this.WIDTH = width;
            this.chart.setAttributeNS(null, "points", this.mapPoints(values));
        } else this.transition(this.mapPoints(this.values), this.mapPoints(values));

        this.values = values;
        // Note: Rising from the bottom does not work
    }

    setSelected(at) {
        if (at) {
            const pos = this.values.find(v => v.at === at);
            const { x, y } = this.mapPoint(pos);

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
