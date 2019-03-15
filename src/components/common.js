const ANIMATION_DURATION = "0.2s";
const NS = "http://www.w3.org/2000/svg";

export const mapPoints = (marks, x, y) =>
    Array.from(marks)
        .map(({ value, at }) => `${x * at} ${y * (value === -1 ? -0.5 : 1 - value)}`) // -50% -> Off-screen
        .join(",");

export const createSVG = (height = "100%") => {
    const graph = document.createElementNS(NS, "svg");
    graph.setAttributeNS(null, "height", height);
    graph.setAttributeNS(null, "width", "100%");
    return graph;
};

export const createChart = color => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttributeNS(null, "stroke", color);
    return line;
};

export const createGroup = (className = null) => {
    const group = document.createElementNS(NS, "g");
    if (className !== null) group.setAttributeNS(null, "class", className);
    return group;
};

export const createLine = y => {
    const line = document.createElementNS(NS, "line");
    line.setAttributeNS(null, "x1", "0%");
    line.setAttributeNS(null, "x2", "100%");
    line.setAttributeNS(null, "y1", y);
    line.setAttributeNS(null, "y2", y);
    return line;
};

export const createPointer = () => {
    const line = document.createElementNS(NS, "line");
    line.setAttributeNS(null, "x1", 0);
    line.setAttributeNS(null, "x2", 0);
    line.setAttributeNS(null, "y1", "0%");
    line.setAttributeNS(null, "y2", "100%");
    line.classList.add("pointer");
    return line;
};

export const createLabel = (x, y) => {
    const label = document.createElementNS(NS, "text");
    label.setAttributeNS(null, "x", x);
    label.setAttributeNS(null, "y", y);
    return label;
};

export const createAnimation = attr => {
    const animate = document.createElementNS(NS, "animate");
    animate.setAttributeNS(null, "dur", ANIMATION_DURATION);
    animate.setAttributeNS(null, "begin", "indefinite");
    animate.setAttributeNS(null, "attributeName", attr);
    // animate.setAttributeNS(null, "fill", "freeze");
    return animate;
};

export const createContainer = (className = null) => {
    const cont = document.createElement("div");
    if (className) cont.className = className;
    return cont;
};

export const createCheck = (content, color) => {
    const label = document.createElement("span");
    const wrapper = document.createElement("span");
    const check = document.createElement("i");
    const text = document.createElement("span");

    label.className = "check";
    text.textContent = content;
    check.className = "fas fa-check check__icon";
    wrapper.className = "check__wrapper";
    check.style.backgroundColor = wrapper.style.borderColor = color;

    wrapper.append(check);
    label.append(wrapper);
    label.append(text);

    return label;
};

export const createRect = (x, y, width, height) => {
    const rect = document.createElementNS(NS, "rect");

    rect.setAttributeNS(null, "x", x);
    rect.setAttributeNS(null, "y", y);
    rect.setAttributeNS(null, "width", width);
    rect.setAttributeNS(null, "height", height);

    return rect;
};
