import flattenLabels, { Labels } from "./index";

describe("Label extraction from Base Results", (): void => {
  const testData1: Labels = {
    homeWin: 1,
    awayWin: 0,
    draw: 0,
    seasonNumber: 1
  };
  const testData2: Labels = {
    homeWin: 0,
    awayWin: 0,
    draw: 1,
    seasonNumber: 1
  };
  test("expect flattened label data to match object properties", (): void => {
    const results = flattenLabels([testData1, testData2]);
    expect(results[0]).toMatchObject([1, 0, 0, 1]);
    expect(results[1]).toMatchObject([0, 0, 1, 1]);
  });
});
