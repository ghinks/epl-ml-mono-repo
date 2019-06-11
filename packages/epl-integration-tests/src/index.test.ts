import findMatchesInPath , { MatchResult } from "@gvhinks/epl-data-reader";
import writeToDB from "@gvhinks/epl-data-to-db";
import createModel, { getTrainingData, TrainingData } from "@gvhinks/epl-base-model";
import * as tf from "@tensorflow/tfjs-node";

describe("Integration Tests", (): void => {
  const LONG_TEST = 30 * 1000;
  const Chelsea = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const WestHam = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0];
  test("expect to git stuff back after you push data into the DB", async () => {
    const stuff: MatchResult[] = await findMatchesInPath("/Users/ghinks/dev/match-analysis/packages/epl-data-reader/data");
    expect(stuff.length).toBeGreaterThan(0);
    const result = await writeToDB(stuff);
    expect(result).toBe(true);
  });
  test("expect to get data for Arsenal", async() => {
    const results: TrainingData = await getTrainingData("Arsenal");
    expect(results.labelValues.length).toBeGreaterThan(0);
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
    const summary = results.reduce((a: Aggregation, r: TrainingData) => {
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
    const testData = tf.tensor3d([ ...Chelsea, ...WestHam], [1,2,36], 'int32');
    const prediction = model.predict(testData);
    // @ts-ignore
    const result = await prediction.data();
    expect(result.length).toBe(3);
    const sumOfWeights = result[0] + result[1] + result[2];
    expect(sumOfWeights).toBeGreaterThan(0.90);
    expect(sumOfWeights).toBeLessThan(1.15);
  }, LONG_TEST);
});
