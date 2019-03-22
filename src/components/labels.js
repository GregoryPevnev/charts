import { createGroup, createLabel } from "./common";
import { distinct } from "../services/utils";

const LABELS_PER_SCREEN = 6;

class Labels {
    getVisibility(relation) {
        // Using percentage for positioning
        const STEP = 100 / LABELS_PER_SCREEN / relation;

        const filtered = [];
        for (let i = 0; i <= 100; i += STEP) filtered.push(Math.round((i / 100) * this.dates.length));

        return distinct(filtered);
    }

    constructor(at, group) {
        this.at = at;
        this.group = group;
        this.dates = [];
    }

    setVisibility(visualWidth, totalWidth) {
        const relation = Math.floor(totalWidth / visualWidth);
        const offset = Math.ceil(this.dates.length / 30);
        const visible = this.getVisibility(relation);

        console.log(offset);

        this.dates.slice(offset, this.dates.length - 1).forEach((label, i) => {
            if (visible.indexOf(i) !== -1) label.classList.add("date--active");
            else label.classList.remove("date--active");
        });
    }

    setDates(dates) {
        const STEP = 100 / (dates.length - 1);
        this.dates = dates.map((date, i) => {
            const label = createLabel(0, this.at);
            label.textContent = date;
            label.classList.add("date"); // Label cannot be stylized and animated by the same class eith group
            label.setAttributeNS(null, "x", STEP * i + "%");
            this.group.append(label);
            return label;
        });
    }

    render(target) {
        target.prepend(this.group);
    }
}

export const getLabels = HEIGHT => new Labels(HEIGHT - 5, createGroup("label")); // Additional 5px of offset for hsowing all characters
