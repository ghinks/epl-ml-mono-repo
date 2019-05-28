import flattenFeatures, { Features } from "./index"

describe("Feature extraction from Base Results", (): void => {
  // oneHot encoded team names
  const testData1: Features = {
    homeTeam: [1, 0, 0],
    awayTeam: [0, 1, 0]
  };
  const testData2: Features = {
    homeTeam: [0, 0, 1],
    awayTeam: [1, 0, 0]
  };
  test("expect features", (): void => {
    const results = flattenFeatures([testData1, testData2]);
    expect(results[0]).toMatchObject([[1,0, 0], [0,1, 0]]);
    expect(results[1]).toMatchObject([[0, 0, 1], [1, 0, 0]]);
    expect(results[1][1][0]).toBe(1);
    expect(results[1][1][1]).toBe(0);
    expect(results[1][1][2]).toBe(0);
  });
});
