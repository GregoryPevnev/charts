export const toPercent = (at, min, max) => Math.abs((at - min) / (max - min));

const GAP = 0.1;

export const getRound = value => {
    const rounded = Math.round(value);
    if (value > rounded - GAP && value < rounded + GAP) return rounded;
    return null;
};

export const inRange = (value, min, max) => Math.min(Math.max(min, value), max);
