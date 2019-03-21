const DEFAULT_COLOR = "#000";
const DEFAULT_OPACITY = 0.2;

class FilterBuilder {
    constructor() {
        this.filters = [];
    }

    // TODO: More filters - Find a usecase
    addShadowFilter(name, { color, opacity } = {}) {
        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter"); // TODO: Name-Spacing
        filter.id = name;
        filter.innerHTML = `<feDropShadow dx="1" dy="2" stdDeviation="5" flood-color="${color ||
            DEFAULT_COLOR}" flood-opacity="${opacity || DEFAULT_OPACITY}" />`;
        this.filters.push(filter);
        return this;
    }

    getDefinition() {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this.filters.forEach(filter => defs.append(filter));
        return defs;
    }
}

const getFilterBuilder = () => new FilterBuilder();

export default getFilterBuilder;
