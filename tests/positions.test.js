import { Positioner } from "../src/services/positioning";

describe("Positions", () => {
    test("should provide 10 positions up to 100", () => {
        const positioner = new Positioner(100, 11);

        [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(v => expect(v).toBe(positioner.getNextPosition()));
    });

    test("should provide 5 positions up to 100 with offset 10", () => {
        const positioner = new Positioner(100, 5, 10);

        [0, 23.5, 47, 70.5, 90].forEach(v => expect(v).toBe(positioner.getNextPosition()));
    });
});
