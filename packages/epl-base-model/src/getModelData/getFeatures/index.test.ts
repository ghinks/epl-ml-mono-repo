import flattenFeatures, { Features } from "./index"

describe("Feature extraction from Base Results", (): void => {
  // oneHot encoded team names
  const testData1: Features = {
    homeTeam: [1, 0, 0],
    awayTeam: [0, 1, 0],
    seasonNumber: 0
  };
  const testData2: Features = {
    homeTeam: [0, 0, 1],
    awayTeam: [1, 0, 0],
    seasonNumber: 1
  };
  test("expect features", (): void => {
    const results: number[] = flattenFeatures([testData1, testData2]);
    expect(results).toMatchObject([
      1, 0, 0,
      0, 1, 0,
      0,
      0, 0, 1,
      1, 0, 0,
      1]);
  });
});
