import findMatchesInPath , { MatchResult } from "@gvhinks/epl-data-reader";
import writeToDB from "@gvhinks/epl-data-to-db";

describe("Integration Tests", () => {
  test("expect to git stuff back after you push data into the DB", async () => {
    const stuff: MatchResult[] = await findMatchesInPath("/Users/ghinks/dev/match-analysis/packages/epl-data-reader/data");
    expect(stuff.length).toBeGreaterThan(0);
    const result = await writeToDB(stuff);
    expect(result).toBe(true);
  });
});
