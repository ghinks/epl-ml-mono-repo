import getFeatures from "./index"
import { BaseResult} from "../index";

describe("Feature extraction from Base Results", (): void => {
  const testData: BaseResult = {
    // oneHot encoded team names
    homeTeam: [1, 0],
    awayTeam: [0, 1],
    homeWin: 1,
    awayWin: 0,
    draw: 0
  };
  test("expect features", (): void => {
    const results = getFeatures([testData]);
    expect(results[0]).toMatchObject({
      homeTeam: testData.homeTeam,
      awayTeam: testData.awayTeam
    });
  });
  test("expect 2 sets of features", (): void => {
    const results = getFeatures([testData, testData]);
    expect(results.length).toBe(2);
  });
});
