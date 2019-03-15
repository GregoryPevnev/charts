import { createLabel, createGroup, createRect, createSVG } from "./common";

// TODO: Come up with a formula
const computeFontSize = text => {
    if (text.length < 5) return "1.3rem";
    if (text.length < 10) return "1.1rem";
    return "0.9rem";
};

// TODO: Better rendering
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
        this.popup.style.visibility = "visible";
        this.popup.setAttributeNS(null, "x", at - 60); // Subtracting half of width
        this.wrapper.setAttributeNS(null, "height", Math.floor(data.length / 2) * 20 + 60);
        this.title.textContent = title;
        this.labels.innerHTML = "";

        // TODO: Caching / Preventing rendering (Only changing text -> No re-rendering)
        data.forEach((item, i) => renderLabel(item, (i % 2) * 60 + 10, Math.floor(i / 2) * 35 + 40, this.labels));
    }

    hide() {
        this.popup.style.visibility = "hidden";
    }

    render(parent) {
        parent.appendChild(this.popup); // Append -> First + TOP
    }
}

// TODO: Refactor into smaller functions
export const getPopup = () => {
    const svg = createSVG("100%");
    const rect = createRect(0, 0, 120, 60);
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
