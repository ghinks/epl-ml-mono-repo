import getHistoricalData, { StandardResult, getFixtures } from "@gvhinks/epl-data-reader";
import writeToDB, { writeFutureFixtures } from "@gvhinks/epl-data-to-db";
import { getTrainingData, TrainingData } from "@gvhinks/epl-base-model";
import { Fixture } from "@gvhinks/epl-common-interfaces";

const LONG_TEST = 5 * 60 * 1000;

describe("DB tests", (): void => {
  test("expect to git stuff back after you push data into the DB", async (): Promise<void> => {
    const retrievedHistResults: StandardResult[] = await getHistoricalData();
    expect(retrievedHistResults.length).toBeGreaterThan(0);
    const result = await writeToDB(retrievedHistResults);
    expect(result).toBe(true);
  });
  test("expect to be able to write future fixtures to the DB", async (): Promise<void> => {
    const stuff: Fixture[] = await getFixtures();
    expect(stuff.length).toBeGreaterThan(0);
    const result = await writeFutureFixtures(stuff);
    expect(result).toBe(true);
  });
  test("expect to get data for Arsenal", async (): Promise<void> => {
    const results: TrainingData = await getTrainingData();
    expect(results.labelValues.length).toBeGreaterThan(0);

    interface Aggregation {
      winCount: number;
      drawCount: number;
      looseCount: number;
    };
    const initialValue: Aggregation = {
      winCount: 0,
      drawCount: 0,
      looseCount: 0
    };
    // one hot encoding W, D, L
    const summary = results.labelValues.reduce((a: Aggregation, r: number[]): Aggregation => {
      if (r[2]) {
        a.drawCount++;
      } else if (r[0]) {
        a.winCount++;
      } else a.looseCount++;
      return a;
    }, initialValue);
    expect(summary.winCount).toBeGreaterThan(0);
    expect(summary.looseCount).toBeGreaterThan(0);
    expect(summary.drawCount).toBeGreaterThan(0);
  }, LONG_TEST);
});
