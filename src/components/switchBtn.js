import { createButton } from "./common";

const DAY_TEXT = "Switch to Night Mode",
    NIGHT_TEXT = "Switch to Day Mode";

class SwitchButton {
    initialize() {
        this.button.addEventListener("click", () => this.listeners.forEach(l => l()));
    }

    constructor(page, btn) {
        this.page = page;
        this.button = btn;

        this.listeners = [];

        this.initialize();
    }

    onSwitch(listener) {
        this.listeners.push(listener);
    }

    switchMode(isNight) {
        if (isNight) {
            this.page.classList.add("night");
            this.button.textContent = NIGHT_TEXT;
        } else {
            this.page.classList.remove("night");
            this.button.textContent = DAY_TEXT;
        }
    }

    render(target) {
        target.append(this.button);
    }
}

export const getSwitchButton = (isDay = true) =>
    new SwitchButton(document.querySelector("body"), createButton(isDay ? DAY_TEXT : NIGHT_TEXT));
