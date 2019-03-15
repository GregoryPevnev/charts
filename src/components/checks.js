import { createContainer, createCheck } from "./common";

class Checks {
    notify(i) {
        this.listeners.forEach(l => l(i));
    }

    initialize() {
        this.labels.forEach((l, i) => l.addEventListener("click", this.notify.bind(this, i)));
    }

    constructor(group, labels) {
        this.group = group;
        this.labels = labels;

        this.initialize();

        this.listeners = [];
    }

    setStates(states) {
        states.forEach((state, i) =>
            state ? this.labels[i].classList.add("check--active") : this.labels[i].classList.remove("check--active")
        );
    }

    onChange(listener) {
        this.listeners.push(listener);
    }

    render(parent) {
        parent.append(this.group);
    }
}

export const getChecks = labels => {
    const cont = createContainer();
    const checks = labels.map(({ label, color }) => {
        const l = createCheck(label, color);
        cont.append(l);
        return l;
    });
    return new Checks(cont, checks);
};
