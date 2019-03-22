import { createContainer, createDraggable } from "./common";
import getWidthController from "./widthController";

class Scroller {
    notifyFrame() {
        this.frameListeners.forEach(l => l());
    }

    notifyChange(state) {
        this.changeListeners.forEach(l => l(state));
    }

    notifyPosition(diff) {
        this.positionListeners.forEach(listener => listener(diff));
    }

    setPosition(currentPosition) {
        const diff = (currentPosition - this.position) / this.frame.getWidth();
        this.position = currentPosition;
        this.notifyPosition(diff);
    }

    handleMove(x) {
        if (this.callback !== null) this.callback(x);
    }

    handleDown(target, x) {
        if (target === this.leftTouch)
            return (this.callback = x => this.notifyChange({ from: this.frame.getStaticPosition(x) }));

        if (target === this.rightTouch)
            return (this.callback = x => this.notifyChange({ to: this.frame.getStaticPosition(x) }));

        if (target === this.draggable) {
            this.callback = x => this.setPosition(x);
            this.position = x;
            return;
        }

        this.callback = null;
    }

    ended() {
        this.callback = null;
        this.notifyFrame();
    }

    initialize() {
        this.bar.addEventListener("mousedown", e => this.handleDown(e.target, e.x));

        // Using Window-Events for better responsiviness and scrolling
        window.addEventListener("mousemove", e => this.handleMove(e.x - this.frame.getStart()));
        window.addEventListener("mouseup", this.ended.bind(this));

        // Mobile Support
        this.bar.addEventListener("touchmove", e => this.handleMove(e.touches[0].clientX));
        this.bar.addEventListener("touchstart", e => this.handleDown(e.target, e.touches[0].clientX));
        this.bar.addEventListener("touchend", this.ended.bind(this));
    }

    constructor(bar, shadow, draggable, frame, leftTouch, rightTouch) {
        this.bar = bar;
        this.shadow = shadow;
        this.draggable = draggable;
        this.leftTouch = leftTouch;
        this.rightTouch = rightTouch;
        this.frame = frame;

        this.callback = null;
        this.position = null;

        this.changeListeners = [];
        this.frameListeners = [];
        this.positionListeners = [];

        this.initialize();
    }

    setWindow(shadow, draggable) {
        this.shadow.style.width = shadow * 100 + "%";
        this.draggable.style.width = draggable * 100 + "%";
    }

    onChange(l) {
        this.changeListeners.push(l);
    }

    onPosition(l) {
        this.positionListeners.push(l);
    }

    onFrame(l) {
        this.frameListeners.push(l);
    }

    render(parent) {
        parent.append(this.bar);
    }
}

export const getScroller = () => {
    const overlay = createContainer("overlay");
    const shadow = createContainer("shadow");
    const draggable = createDraggable();
    const leftTouch = createContainer("draggable__dragger");
    const rightTouch = createContainer("draggable__dragger");

    draggable.append(leftTouch);
    draggable.append(rightTouch);
    overlay.append(shadow);
    overlay.append(draggable);
    overlay.append(createContainer("shadow"));

    return new Scroller(overlay, shadow, draggable, getWidthController(overlay), leftTouch, rightTouch);
};
