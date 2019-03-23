import { inRange } from "../services/scaling";
import { POINT_RADIUS } from "./common";

const FIX = POINT_RADIUS * 2 - 3.5;

class Canvas {
    getPoint({ value, at }) {
        return {
            x: this.width * at,
            y: this.height * (value === -1 ? -0.5 : 1 - value) // -50% -> Off-screen
        };
    }

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    setWidth(width) {
        this.width = width;
    }

    mapPoint(coordinate) {
        const { x, y } = this.getPoint(coordinate);

        return {
            x: inRange(x, FIX, this.width - FIX),
            y: inRange(y, FIX, this.height - FIX)
        };
    }

    mapPoints(marks) {
        return marks
            .map(v => {
                const { x, y } = this.getPoint(v);
                return `${x} ${y}`;
            })
            .join(",");
    }
}

export const getCanvas = (width, height) => new Canvas(width, height);
