class WidthController {
    constructor() {
        this.elem = null;
        this.width = 0;
    }

    bind(element) {
        this.elem = element;
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

    getVisibleWidth() {
        return this.elem.getBoundingClientRect().width;
    }

    getStart() {
        return this.elem.getBoundingClientRect().left;
    }

    getOffset() {
        return this.elem.scrollLeft - this.elem.getBoundingClientRect().left;
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
