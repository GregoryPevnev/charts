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
            this.button.textContent = "Switch to Day Mode";
        } else {
            this.page.classList.remove("night");
            this.button.textContent = "Switch to Night Mode";
        }
    }
}

export const getSwitchButton = () => {
    const page = document.querySelector("body");
    const button = document.querySelector(".btn");

    return new SwitchButton(page, button);
};
