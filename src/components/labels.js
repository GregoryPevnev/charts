import { HEIGHT } from "./values";
import { createGroup, createLabel } from "./common";

const EXTRA = 5;

class Labels {
    constructor(group) {
        this.group = group;
    }

    setDates(dates) {
        // TODO: Animations + Cache (Compare + Animations - As planned)
        this.group.innerHTML = "";

        dates.forEach((date, i) => {
            const position = (100 / dates.length) * i + "%"; // TODO: Replace with pixels
            const label = createLabel(position, HEIGHT - EXTRA);
            label.textContent = date;
            label.classList.add("date");
            this.group.appendChild(label);
        });
    }

    render(target) {
        target.prepend(this.group);
    }
}

export const getLabels = () => new Labels(createGroup("label"));
