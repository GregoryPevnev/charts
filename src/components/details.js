import { createLabel, createGroup, createRect, createSVG } from "./common";

export const DETAIL_WIDTH = 120;
export const DETAIL_HEIGHT = 60;

const computeFontSize = text => {
    if (text.length < 5) return "1.3rem";
    if (text.length < 10) return "1.1rem";
    return "0.9rem";
};

const renderLabel = ({ value, label, color }, x, y, target) => {
    const wrapper = createGroup();
    const number = createLabel(x, y);
    const text = createLabel(x, y + 14);

    wrapper.append(number);
    wrapper.append(text);
    number.textContent = value;
    text.textContent = label;
    text.style.fontSize = computeFontSize(label);
    wrapper.setAttributeNS(null, "fill", color);
    number.style.fontWeight = "bold";
    number.style.fontSize = computeFontSize(String(value));

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
        const HEIGHT = Math.ceil(data.length / 2) * 20 + DETAIL_HEIGHT; // Ceil -> Increasing width for even

        this.popup.style.visibility = "visible";
        this.popup.setAttributeNS(null, "x", at);
        this.wrapper.setAttributeNS(null, "height", HEIGHT);
        this.title.textContent = title;
        this.labels.innerHTML = "";

        // TODO: Better formulas and rendering
        // TODO: Caching / Preventing rendering (Only changing text -> No re-rendering)
        data.forEach((item, i) => {
            const X = (i % 2) * 60 + 10;
            const Y = Math.floor(i / 2) * 35 + 40; // Floor -> Only moving when the row is full
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
    const rect = createRect(0, 0, DETAIL_WIDTH, DETAIL_HEIGHT);
    const title = createLabel(0, 0);
    const labels = createGroup();

    svg.append(rect);
    svg.append(title);
    svg.append(labels);

    title.setAttributeNS(null, "x", 24);
    title.setAttributeNS(null, "y", 15);
    title.classList.add("popup__title");

    rect.classList.add("popup");
    rect.setAttributeNS(null, "rx", 5);
    rect.setAttributeNS(null, "ry", 5);
    rect.setAttributeNS(null, "filter", "url(#shadow)");

    return new DetailsPopup(svg, rect, title, labels);
};
