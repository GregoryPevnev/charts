import { inRange } from "../services/scaling";

class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    mapPoint({ value, at }) {
        return {
            x: this.width * inRange(at, 0, 1),
            y: this.height * (value === -1 ? -0.5 : 1 - value) // -50% -> Off-screen
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
}

export const getCanvas = (width, height) => new Canvas(width, height);
