import { createLabel, createGroup, createRect, createSVG, POINT_RADIUS } from "./common";

const DETAIL_WIDTH = 130;
const DETAIL_HEIGHT = 25;
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

    setData(title, data) {
        this.title.textContent = title;
        this.labels.innerHTML = "";

        data.forEach((item, i) => {
            const X = (i % 2) * 60 + 15;
            const Y = Math.floor(i / 2) * 45 + 55; // Floor -> Only moving when the row is full
            renderLabel(item, X, Y, this.labels);
        });
    }

    show(pos, relPos, labels) {
        const HEIGHT = Math.ceil(labels / 2) * 55 + DETAIL_HEIGHT; // Ceil -> Increasing width for even
        const AT = relPos <= DETAIL_WIDTH ? pos - DETAIL_WIDTH - POINT_RADIUS * 3 : pos + POINT_RADIUS; // Note additional values to keep points visible

        this.popup.style.visibility = "visible";
        this.popup.setAttributeNS(null, "x", AT);
        this.wrapper.setAttributeNS(null, "height", HEIGHT);
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
    const rect = createRect(5, 5, DETAIL_WIDTH, DETAIL_HEIGHT, 10);
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
