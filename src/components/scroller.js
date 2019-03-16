import { createContainer, createSVG, createChart, mapPoints } from "./common";

const NO = 0;
const LEFT_RESIZE = 1;
const RIGHT_RESIZE = 2;
const MOVE = 3;

// TODO: Refactor VERY HEAVILY
class Scroller {
    notify(state) {
        this.changeListeners.forEach(l => l(state));
    }

    getPosition(x) {
        const rect = this.bar.getBoundingClientRect();
        return (x - rect.left) / rect.width;
    }

    // Using X (Global) for now -> Refactor into relative positioning if possible
    setPosition(currentPosition) {
        const diff = (currentPosition - this.position) / this.bar.getBoundingClientRect().width;
        this.position = currentPosition;
        this.positionListeners.forEach(listener => listener(diff));
    }

    handleMove(x) {
        switch (this.state) {
            case LEFT_RESIZE:
                return this.notify({ from: this.getPosition(x) });
            case RIGHT_RESIZE:
                return this.notify({ to: this.getPosition(x) });
            case MOVE:
                return this.setPosition(x);
        }
    }

    handleDown(target, x) {
        if (target === this.leftTouch) this.state = LEFT_RESIZE;
        else if (target === this.rightTouch) this.state = RIGHT_RESIZE;
        else if (target === this.draggable) {
            this.state = MOVE;
            this.position = x;
        }
    }

    initialize() {
        this.bar.addEventListener("mousemove", e => this.handleMove(e.x));
        this.bar.addEventListener("mousedown", e => this.handleDown(e.target, e.x));
        this.bar.addEventListener("mouseup", () => (this.state = NO));
        this.bar.addEventListener("mouseleave", () => (this.state = NO));

        this.bar.addEventListener("touchmove", e => this.handleMove(e.touches[0].clientX));
        this.bar.addEventListener("touchstart", e => this.handleDown(e.target, e.touches[0].clientX));
        this.bar.addEventListener("touchend", () => (this.state = NO));
    }

    constructor(bar, shadow, draggable, leftTouch, rightTouch) {
        this.bar = bar;
        this.shadow = shadow;
        this.draggable = draggable;
        this.leftTouch = leftTouch;
        this.rightTouch = rightTouch;

        this.state = NO;
        this.position = null;
        this.from = 0;
        this.to = 0;

        this.changeListeners = [];
        this.positionListeners = [];

        this.initialize();
    }

    setWindow(from, to) {
        this.from = from;
        this.to = to;
        this.shadow.style.width = this.from * 100 + "%";
        this.draggable.style.width = (this.to - this.from) * 100 + "%";
    }

    onChange(l) {
        this.changeListeners.push(l);
    }

    onPosition(l) {
        this.positionListeners.push(l);
    }

    render(parent) {
        parent.append(this.bar);
    }
}

const createDraggable = () => {
    const draggable = createContainer("draggable");
    draggable.draggable = false;
    draggable.ondragstart = () => false;
    return draggable;
};

export const getScroller = () => {
    const overlay = createContainer("overlay");

    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS(null, "height", "100%");
    image.setAttributeNS(null, "width", "100%");
    image.setAttributeNS(null, "height", "100%");

    const shadow = createContainer("shadow");
    const draggable = createDraggable();
    const leftTouch = createContainer();
    const rightTouch = createContainer();

    draggable.append(leftTouch);
    draggable.append(rightTouch);
    overlay.append(shadow);
    overlay.append(draggable);
    overlay.append(createContainer("shadow"));

    return new Scroller(overlay, shadow, draggable, leftTouch, rightTouch);
};
