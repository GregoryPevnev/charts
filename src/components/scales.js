import { createLine, createLabel, createGroup } from "./common";
import { ROW_SPAN, LABEL_SPAN, HEIGHT, LABEL_OFFSET_X, LABEL_OFFSET_Y, ROWS } from "./values";

class Scales {
    constructor(group, labels) {
        this.group = group;
        this.labels = labels;
    }

    move(by) {
        this.labels.forEach(label => label.setAttributeNS(null, "x", by + LABEL_OFFSET_X));
    }

    label(max) {
        this.labels.forEach((label, i) => (label.textContent = Math.ceil(max * (ROW_SPAN / 100) * i)));
    }

    render(cont) {
        cont.prepend(this.group);
    }
}

export const getScales = () => {
    const unit = ((HEIGHT - LABEL_SPAN) / 100) * ROW_SPAN;
    let position = HEIGHT - LABEL_SPAN;

    const group = createGroup();
    group.style.position = "fixed";
    const linesTarget = createGroup("line");
    const labelsTarget = createGroup("label");

    const labels = [];

    for (let i = 0; i < ROWS; i++) {
        const label = createLabel(LABEL_OFFSET_X, position + LABEL_OFFSET_Y, ROW_SPAN * i + "%");
        labels.push(label);
        linesTarget.appendChild(createLine(position));
        labelsTarget.appendChild(label);
        position -= unit;
    }

    group.appendChild(linesTarget);
    group.appendChild(labelsTarget);

    return new Scales(group, labels);
};
