export const distinct = list => Array.from(new Set(list));

export const equal = (list1, list2) => list1.every((elem, i) => elem === list2[i]);

export const powerOf = (value, pow) => {
    let i = 1;
    while (value > pow * i) i++;
    return pow * i;
};
