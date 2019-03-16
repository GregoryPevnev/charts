export const toPercent = (at, min, max) => Math.abs((at - min) / (max - min));

export const getRound = value => {
    const rounded = Math.round(value);
    if (value > rounded - 0.1 && value < rounded + 0.1) return rounded;
    return null;
};

export const inRange = (value, min, max) => Math.min(Math.max(min, value), max);
