import { inRange } from "./scaling";

export class Positioner {
    initialize() {
        const space = this.width - this.count * this.offset;
        this.unit = space / (this.count - 1) + this.offset;
    }

    constructor(width, count, offset = 0) {
        this.width = width;
        this.count = count;
        this.offset = offset;

        this.unit = 0;
        this.position = 0;

        this.initialize();
    }

    getNextPosition() {
        if (this.position === this.count) return null;

        const opt = ((this.position + 1 - this.count / 5) / this.count) * (this.offset / 2);
        const result = inRange(this.unit * this.position + opt, 0, this.width - this.offset);
        this.position++;
        return result;
    }
}
