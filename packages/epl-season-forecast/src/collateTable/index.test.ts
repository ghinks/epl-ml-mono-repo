import { collateTable } from "./index";
import { testSet1, testHomeAwayWin, TestFixPred, createFixPred } from "./testData";
import { Forecast, FixturePrediction } from "@gvhinks/epl-common-interfaces";

describe("Collation of Forecasts to a table", () => {
  describe("Basics", () => {
    test("expect a table of size 3", (): void => {
      const forecast: Forecast[] = collateTable(testSet1);
      expect(forecast.length).toBe(6);
      const totalPts = forecast.reduce((a: number, c: Forecast) => {
        const pts = a + (c.wins * 3) + (c.draws * 1);
        return pts;
      }, 0);
      // 3 + 3 + 1 + 1
      expect(totalPts).toEqual(8);
    });
    test("expect teamA to have 6 pts", (): void => {
      const forecast: Forecast[] = collateTable(testHomeAwayWin);
      expect(forecast.length).toBe(2);
      const points = forecast.reduce((a: number, c: Forecast) => {
        if (c.team === "teamA") {
          const pts = a + c.wins * 3 + c.draws * 1;
          return pts;
        }
        return a;
      }, 0);
      expect(points).toBe(6);
    });
  });
  describe("Cases", () => {
    // A v B , [0, 0, 1]
    // A v C , [0, 0, 1]
    // B v A , [0, 0, 1]
    // B v C , [0, 0, 1]
    // C v A , [0, 0, 1]
    // C v B , [0, 0, 1]
    test("3 teams all draws", () => {
      const draw: number[] = [0, 0, 1];
      const testFx: FixturePrediction[] = createFixPred([
        {
          teamA: "teamA",
          teamB: "teamB",
          result: draw
        },
        {
          teamA: "teamA",
          teamB: "teamC",
          result: draw
        },
        {
          teamA: "teamB",
          teamB: "teamA",
          result: draw
        },
        {
          teamA: "teamB",
          teamB: "teamC",
          result: draw
        },
        {
          teamA: "teamC",
          teamB: "teamA",
          result: draw
        },
        {
          teamA: "teamC",
          teamB: "teamB",
          result: draw
        }
      ]);
      const forecast: Forecast[] = collateTable(testFx);
      expect(forecast.length).toBe(3);
      forecast.forEach((f: Forecast): void => {
        expect(f.wins).toBe(0);
        expect(f.loses).toBe(0);
        expect(f.draws).toBe(4);
        expect(f.points).toBe(4)
      });
    });
  });
});
