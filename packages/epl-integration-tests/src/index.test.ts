import findMatchesInPath , { MatchResult } from "@gvhinks/epl-data-reader";
import writeToDB from "@gvhinks/epl-data-to-db";
import createModel, { getData, BaseResult } from "@gvhinks/epl-base-model";

describe("Integration Tests", (): void => {
  test("expect to git stuff back after you push data into the DB", async () => {
    const stuff: MatchResult[] = await findMatchesInPath("/Users/ghinks/dev/match-analysis/packages/epl-data-reader/data");
    expect(stuff.length).toBeGreaterThan(0);
    const result = await writeToDB(stuff);
    expect(result).toBe(true);
  });
  test("expect to get the model date", async() => {
    const results: BaseResult[] = await getData("Arsenal");
    expect(results.length).toBeGreaterThan(0);
    interface Aggregation {
      winCount: number;
      drawCount: number;
      looseCount: number;
    };
    let initialValue: Aggregation = {
      winCount: 0,
      drawCount: 0,
      looseCount: 0
    };
    const summary = results.reduce((a: Aggregation, r: BaseResult) => {
      if (r.draw) {
        a.drawCount++;
      } else if (r.win) {
        a.winCount++
      } else a.looseCount++;
      return a;
    }, initialValue);
    expect(summary.winCount).toBeGreaterThan(0);
    expect(summary.looseCount).toBeGreaterThan(0);
    expect(summary.drawCount).toBeGreaterThan(0);

  });
  test("expect to create a model", async () => {
    const model = await createModel();
    expect(model).toBeTruthy();
  });
});
