class WidthController {
    constructor() {
        this.elem = null;
        this.width = 0;
    }

    bind(element) {
        this.elem = element;
    }

    getVisibleWidth() {
        return this.elem.clientWidth;
    }

    getWidth() {
        return this.width || this.getVisibleWidth();
    }

    setWidth(width) {
        this.width = width;
    }

    setRelation(relation) {
        this.width = this.getVisibleWidth() / relation;
    }

    getStart() {
        return this.elem.offsetLeft;
    }

    getOffset() {
        return this.elem.scrollLeft - this.getStart();
    }

    getStaticPosition(x) {
        return (x - this.getStart()) / this.getWidth();
    }

    getRelativePosition(at) {
        const position = this.getWidth() * at;
        const relativePosition = this.getVisibleWidth() - (position - this.getOffset());

        return { position, relativePosition };
    }
}

const getWidthController = (elem = null) => {
    const controller = new WidthController();
    if (elem) controller.bind(elem);
    return controller;
};

export default getWidthController;
