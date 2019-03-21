import { HEIGHT } from "./values";
import { createGroup, createLabel } from "./common";
import { Positioner } from "../services/positioning";
import { distinct } from "../services/utils";

const LABELS_PER_SCREEN = 6;
const EXTRA = 5;
const LABEL = 40;

class Labels {
    getVisibility(relation) {
        const STEP = 100 / LABELS_PER_SCREEN / relation;

        const filtered = [];
        for (let i = 0; i <= 101; i += STEP) filtered.push(Math.floor(Math.min(i / 100, 1) * this.dates.length));

        return distinct(filtered);
    }

    constructor(at, group) {
        this.at = at;
        this.group = group;
        this.dates = [];
    }

    setVisibility(visualWidth, totalWidth) {
        const relation = Math.floor(totalWidth / visualWidth);
        const visible = this.getVisibility(relation);
        const positioner = new Positioner(totalWidth, visible.length, LABEL);

        this.dates.forEach((label, i) => {
            if (visible.indexOf(i) !== -1) {
                label.classList.add("date--active");
                label.setAttributeNS(null, "x", positioner.getNextPosition());
            } else label.classList.remove("date--active");
        });
    }

    setDates(dates) {
        this.dates = dates.map(date => {
            const label = createLabel(0, this.at);
            label.textContent = date;
            label.classList.add("date");
            this.group.append(label);
            return label;
        });
    }

    render(target) {
        target.prepend(this.group);
    }
}

export const getLabels = () => new Labels(HEIGHT - EXTRA, createGroup("label"));
