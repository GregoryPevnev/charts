import { HEIGHT } from "./values";
import { createGroup, createLabel } from "./common";
import { Positioner } from "../services/positioning";

const EXTRA = 5;
const LABEL = 40;

class Labels {
    constructor(at, group) {
        this.at = at;
        this.group = group;
    }

    setDates(width, dates) {
        // TODO: Animations + Cache (Compare + Animations - As planned)
        // Note: Do NOT Touch positioning, until the VERY end - It works jsut fine
        const positioner = new Positioner(width, dates.length, LABEL);

        this.group.innerHTML = "";

        dates.forEach(date => {
            const label = createLabel(positioner.getNextPosition(), this.at);
            label.textContent = date;
            label.classList.add("date");
            this.group.append(label);
        });
    }

    render(target) {
        target.prepend(this.group);
    }
}

export const getLabels = () => new Labels(HEIGHT - EXTRA, createGroup("label"));
