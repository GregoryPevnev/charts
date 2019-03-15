export const toPercent = (at, min, max) => Math.abs((at - min) / (max - min));

export const isClose = value => Math.abs(Math.round(value) - value) < 0.1;
