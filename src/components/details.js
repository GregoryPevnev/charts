import { createLabel, createGroup, createRect, createSVG } from "./common";

export const DETAIL_WIDTH = 130;
export const DETAIL_HEIGHT = 25;

// TODO: Refactor rendering and formulas / values

const DEFAULT_SIZE = 1.2;
const computeFontSize = (text, rel = 1) => {
    const dec = Math.floor(text.length / 5);
    const size = (DEFAULT_SIZE - 0.2 * dec) * rel;
    return size + "rem";
};

const renderLabel = ({ value, label, color }, x, y, target) => {
    const X = x + (8 - String(value).length) * 2.5;

    const wrapper = createGroup();
    const number = createLabel(X, y);
    const text = createLabel(X, y + 20);

    wrapper.append(number);
    wrapper.append(text);
    number.textContent = value;
    text.textContent = label;
    text.style.fontSize = computeFontSize(label);
    wrapper.setAttributeNS(null, "fill", color);
    number.style.fontWeight = "bold";
    number.style.fontSize = computeFontSize(String(value), 1.3);

    target.append(wrapper);
};

class DetailsPopup {
    constructor(popup, wrapper, title, labels) {
        this.popup = popup;
        this.wrapper = wrapper;
        this.title = title;
        this.labels = labels;
    }

    setData(at, title, data) {
        const HEIGHT = Math.ceil(data.length / 2) * 55 + DETAIL_HEIGHT; // Ceil -> Increasing width for even

        this.popup.style.visibility = "visible";
        this.popup.setAttributeNS(null, "x", at);
        this.wrapper.setAttributeNS(null, "height", HEIGHT);
        this.title.textContent = title;
        this.labels.innerHTML = "";

        // TODO: Better formulas and rendering
        // TODO: Caching / Preventing rendering (Only changing text -> No re-rendering)
        data.forEach((item, i) => {
            const X = (i % 2) * 60 + 15;
            const Y = Math.floor(i / 2) * 45 + 55; // Floor -> Only moving when the row is full
            renderLabel(item, X, Y, this.labels);
        });
    }

    hide() {
        this.popup.style.visibility = "hidden";
    }

    render(parent) {
        parent.appendChild(this.popup); // Append -> First + TOP
    }
}

export const getPopup = () => {
    const svg = createSVG("100%");
    const rect = createRect(5, 5, DETAIL_WIDTH, DETAIL_HEIGHT);
    const title = createLabel(30, 20);
    const labels = createGroup();

    svg.append(rect);
    svg.append(title);
    svg.append(labels);

    title.classList.add("popup__title");

    rect.classList.add("popup");
    rect.setAttributeNS(null, "filter", "url(#shadow)");

    return new DetailsPopup(svg, rect, title, labels);
};
