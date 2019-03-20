import { getRounder, toPercent } from "../src/services/scaling";
import { formatFullDate, formatDate } from "../src/services/dates";

describe("Math Services", () => {
    test("should round", () => {
        expect(getRounder(0.1)(25.91)).toBe(26);
        expect(getRounder(0.1)(25.07)).toBe(25);
    });

    test("should not round", () => {
        expect(getRounder(0.1)(25.89)).toBeNull();
        expect(getRounder(0.1)(25.11)).toBeNull();
    });

    test("should get percentage", () => {
        expect(toPercent(3, 2, 4)).toBe(0.5);
        expect(toPercent(5, 0, 10)).toBe(0.5);
        expect(toPercent(9, 8, 10)).toBe(0.5);
    });
});

describe("Dates Services", () => {
    const DATE1 = 1242355643336;
    const DATE2 = 675675575676;

    test("should get date", () => {
        expect(formatDate(DATE1)).toBe("May 14");
        expect(formatDate(DATE2)).toBe("May 31");
    });

    test("should get full date", () => {
        expect(formatFullDate(DATE1)).toBe("Thu, May 14");
        expect(formatFullDate(DATE2)).toBe("Fri, May 31");
    });
});
