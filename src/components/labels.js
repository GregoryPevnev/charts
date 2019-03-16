import { HEIGHT } from "./values";
import { createGroup, createLabel } from "./common";
import { Positioner } from "../services/positioning";

const EXTRA = 5;
const LABEL = 40;

class Labels {
    constructor(at, group) {
        this.at = at;
        this.group = group;
        this.dates = [];
    }

    setVisibility(width, visible) {
        const positioner = new Positioner(width, visible.length, LABEL);

        this.dates.forEach((label, i) => {
            if (visible.indexOf(i) !== -1) {
                label.classList.add("date--active");
                label.setAttributeNS(null, "x", positioner.getNextPosition()); // TODO: Make OOP if needed
            } else label.classList.remove("date--active"); // TODO: Different Class-Naming
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
