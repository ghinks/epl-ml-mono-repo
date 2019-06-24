import findMatchesInPath , { MatchResult } from "@gvhinks/epl-data-reader";
import writeToDB from "@gvhinks/epl-data-to-db";
import createModel, { getTrainingData, TrainingData, getNames } from "@gvhinks/epl-base-model";
import * as tf from "@tensorflow/tfjs-node";
// import * as fs from "fs";

const LONG_TEST = 60 * 1000;

describe("Integration Tests", (): void => {

  const Chelsea = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const WestHam = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0];
  let teams;
  beforeAll(async (): Promise<void> => {
    teams = await getNames();
  });
  test("expect to git stuff back after you push data into the DB", async () => {
    const stuff: MatchResult[] = await findMatchesInPath("/Users/ghinks/dev/match-analysis/packages/epl-data-reader/data");
    expect(stuff.length).toBeGreaterThan(0);
    const result = await writeToDB(stuff);
    expect(result).toBe(true);
  });
  test("expect to get data for Arsenal", async() => {
    const results: TrainingData = await getTrainingData();
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
    // one hot encoding W, D, L
    const summary = results.labelValues.reduce((a: Aggregation, r: TrainingData) => {
      if (r[2]) {
        a.drawCount++;
      } else if (r[0]) {
        a.winCount++
      } else a.looseCount++;
      return a;
    }, initialValue);
    expect(summary.winCount).toBeGreaterThan(0);
    expect(summary.looseCount).toBeGreaterThan(0);
    expect(summary.drawCount).toBeGreaterThan(0);
  }, LONG_TEST);
  test("expect to create a model and make a prediction", async () => {
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
  test("test a model using the reserved 2019 test data set", async () => {
    const model = await createModel();
    const { labelValues: testLabels, featureValues: testFeatures } = await getTrainingData(/^2019.*/);
    expect(testLabels.length).toBeGreaterThan(0);
    const testData = tf.tensor3d([ ...testFeatures[0][0], ...testFeatures[0][1]], [1,2,36], 'int32');
    const prediction = model.predict(testData);
    const result = await prediction.data();
    expect(result.length).toBe(3);
    console.log(`predicted result = ${result} and testLabel is ${testLabels[0]}`);
  }, LONG_TEST);
});
