import { NS } from "./common";

const DEFAULT_COLOR = "#000";
const DEFAULT_OPACITY = 0.2;
const DEFAULT_BLUR = 3;

class FilterBuilder {
    addFilter(name, content) {
        const filter = document.createElementNS(NS, "filter");
        filter.id = name;
        filter.innerHTML = content;
        this.filters.push(filter);
    }

    constructor() {
        this.filters = [];
    }

    addBlurFilter(name, { blur } = {}) {
        this.addFilter(name, `<feGaussianBlur in="SourceGraphic" stdDeviation="${blur || DEFAULT_BLUR}" />`);
        return this;
    }

    addShadowFilter(name, { color, opacity } = {}) {
        this.addFilter(
            name,
            `<feDropShadow 
        dx="1" dy="2" stdDeviation="5" 
        flood-color="${color || DEFAULT_COLOR}" 
        flood-opacity="${opacity || DEFAULT_OPACITY}" 
    />`
        );
        return this;
    }

    getDefinition() {
        const defs = document.createElementNS(NS, "defs");
        this.filters.forEach(filter => defs.append(filter));
        return defs;
    }
}

const getFilterBuilder = () => new FilterBuilder();

export default getFilterBuilder;
