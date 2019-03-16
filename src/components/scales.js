import { createLine, createLabel, createGroup } from "./common";
import { ROW_SPAN, LABEL_SPAN, HEIGHT, LABEL_OFFSET_X, LABEL_OFFSET_Y, ROWS } from "./values";

// TODO: Refactor REALLY HEAVILY
const UNIT = ((HEIGHT - LABEL_SPAN) / 100) * ROW_SPAN;
const INIT_POSITION = HEIGHT - LABEL_SPAN + LABEL_OFFSET_Y;

const renderLabels = (max, x) => {
    const labels = [];

    for (let i = 1; i < ROWS; i++) {
        const value = max === 0 ? null : Math.ceil(max * (ROW_SPAN / 100) * i);
        const label = createLabel(LABEL_OFFSET_X + x, INIT_POSITION - UNIT * i, ROW_SPAN * i + "%");

        label.classList.add("animate");
        label.textContent = String(value || "");

        labels.push(label);
    }

    return labels;
};

class Scales {
    cleanUp(labels) {
        setTimeout(() => labels.forEach(label => label.remove()), 300);
    }

    getClasses(max) {
        if (this.max === null) return { inClass: null, outClass: null };
        if (this.max < max) return { inClass: "enterDown", outClass: "leaveUp" };
        return { inClass: "enterUp", outClass: "leaveDown" };
    }

    initialize() {
        this.staticLabel = createLabel(LABEL_OFFSET_X, INIT_POSITION, ROW_SPAN + "%");
        this.staticLabel.textContent = 0;
        this.labelsGroup.append(this.staticLabel);
    }

    constructor(linesGroup, labelsGroup) {
        this.linesGroup = linesGroup;
        this.labelsGroup = labelsGroup;
        this.newLabels = [];
        this.oldLabels = [];
        this.staticLabel = null;
        this.max = null;
        this.offset = 0;

        this.initialize();
    }

    move(by) {
        this.offset = by;
        [...this.newLabels, ...this.oldLabels, this.staticLabel].forEach(label =>
            label.setAttributeNS(null, "x", by + LABEL_OFFSET_X)
        );
    }

    scale(max) {
        if (this.max === max) return; // TODO: Document Rule - Avoid unnecessary rendering
        const { inClass, outClass } = this.getClasses(max);

        this.oldLabels = this.newLabels;
        this.newLabels = renderLabels(max, this.offset);
        this.newLabels.forEach((label, i) => {
            this.labelsGroup.append(label);
            if (inClass !== null) label.classList.add(inClass);
        });

        if (outClass !== null) this.oldLabels.forEach(label => label.classList.add(outClass));

        this.cleanUp(this.oldLabels);

        this.max = max;
    }

    render(cont) {
        cont.prepend(this.linesGroup);
        cont.prepend(this.labelsGroup);
    }
}

export const getScales = () => {
    const linesTarget = createGroup("line");
    const labelsTarget = createGroup("label");

    for (let i = 0; i < ROWS; i++) linesTarget.appendChild(createLine(HEIGHT - LABEL_SPAN - UNIT * i));

    return new Scales(linesTarget, labelsTarget);
};
