import getLabels from "./index";
import { BaseResult } from "../index";

describe("Label extraction from Base Results", (): void => {
  const testData: BaseResult = {
    homeTeam: "teamA",
    awayTeam: "teamB",
    homeWin: 1,
    awayWin: 0,
    draw: 0
  };
  test("expect labels", (): void => {
    const results = getLabels([testData]);
    expect(results[0]).toMatchObject({
      homeWin: testData.homeWin,
      awayWin: testData.awayWin,
      draw: testData.draw
    });
  });
  test("expect 2 sets of labels", (): void => {
    const results = getLabels([testData, testData]);
    expect(results.length).toBe(2);
  });
});
