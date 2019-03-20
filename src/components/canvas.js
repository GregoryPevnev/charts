class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    setWidth(width) {
        this.width = width;
    }

    mapPoint({ value, at }) {
        return {
            x: this.width * at,
            // TODO: Make a static value
            y: this.height * (value === -1 ? -0.5 : 1 - value) // -50% -> Off-screen
        };
    }

    mapPoints(marks) {
        return marks
            .map(v => {
                const { x, y } = this.mapPoint(v);
                return `${x} ${y}`;
            })
            .join(",");
    }
}

export const getCanvas = (width, height) => new Canvas(width, height);
