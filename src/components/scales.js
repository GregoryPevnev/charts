import { createLine, createLabel, createGroup } from "./common";

const LABEL_SPAN = 20;
const ROW_SPAN = 18; // Percentage span between columns(Max - 90%)
const LABEL_OFFSET_X = 5;
const LABEL_OFFSET_Y = -5;
const ROWS = 6;

class Scales {
    cleanUp(labels) {
        setTimeout(() => labels.forEach(label => label.remove()), 250);
    }

    renderLabels(max) {
        const labels = [];

        for (let i = 1; i < ROWS; i++) {
            const value = max === 0 ? null : Math.ceil(max * (ROW_SPAN / 100) * i);
            const label = createLabel(
                LABEL_OFFSET_X + this.offset,
                this.INIT_POSITION - this.UNIT * i,
                ROW_SPAN * i + "%"
            );

            label.classList.add("animate");
            label.textContent = String(value || "");

            labels.push(label);
        }

        return labels;
    }

    getClasses(max) {
        if (this.max === null) return { inClass: null, outClass: null };
        if (this.max < max) return { inClass: "enterDown", outClass: "leaveUp" };
        return { inClass: "enterUp", outClass: "leaveDown" };
    }

    initialize() {
        this.staticLabel = createLabel(LABEL_OFFSET_X, this.INIT_POSITION, ROW_SPAN + "%");
        this.staticLabel.textContent = 0;
        this.labelsGroup.append(this.staticLabel);
    }

    constructor(linesGroup, labelsGroup, UNIT, INIT_POSITION) {
        this.linesGroup = linesGroup;
        this.labelsGroup = labelsGroup;
        this.newLabels = [];
        this.oldLabels = [];
        this.staticLabel = null;
        this.max = null;
        this.offset = 0;

        this.UNIT = UNIT;
        this.INIT_POSITION = INIT_POSITION;

        this.initialize();
    }

    move(by) {
        this.offset = by;
        [...this.newLabels, ...this.oldLabels, this.staticLabel].forEach(label =>
            label.setAttributeNS(null, "x", by + LABEL_OFFSET_X)
        );
    }

    scale(max) {
        if (this.max === max) return;
        const { inClass, outClass } = this.getClasses(max);

        this.oldLabels = this.newLabels;
        this.newLabels = this.renderLabels(max);
        this.newLabels.forEach(label => {
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

export const getScales = HEIGHT => {
    const UNIT = ((HEIGHT - LABEL_SPAN) / 100) * ROW_SPAN;
    const INIT_POSITION = HEIGHT - LABEL_SPAN + LABEL_OFFSET_Y;

    const linesTarget = createGroup("line");
    const labelsTarget = createGroup("label");

    for (let i = 0; i < ROWS; i++) linesTarget.appendChild(createLine(HEIGHT - LABEL_SPAN - UNIT * i));

    return new Scales(linesTarget, labelsTarget, UNIT, INIT_POSITION);
};
