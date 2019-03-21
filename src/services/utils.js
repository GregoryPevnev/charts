export const distinct = list => Array.from(new Set(list));

// TODO: Make snippet / etc.
export const equal = (list1, list2) => list1.every((elem, i) => elem === list2[i]);
