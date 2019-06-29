import findMatchesInPath , { MatchResult } from "@gvhinks/epl-data-reader";
import writeToDB from "@gvhinks/epl-data-to-db";
import createModel, { getTrainingData, TrainingData, getNames, save} from "@gvhinks/epl-base-model";
import * as tf from "@tensorflow/tfjs-node";
import { createPredictionResult, AsyncPredResult, createArrPrdFuncReqs, createTeamNameLookup, PredictResult, getOneHotEncoding } from "@gvhinks/epl-utilities";
import { io } from '@tensorflow/tfjs-core';
import * as fs from "fs";
const LONG_TEST = 2 * 60 * 1000;

describe("Integration Tests", (): void => {

  const Chelsea = getOneHotEncoding("Chelsea");
  const WestHam = getOneHotEncoding("West Ham");
  let teams;
  beforeAll(async (): Promise<void> => {
    teams = await getNames();
  });
  describe("DB tests", () => {
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
  });

  describe("Model Tests", () => {
    afterAll(() => {
      //remove test files if they exist
      const files = [`${__dirname}/model.json`, `${__dirname}/weights.bin`];
      files.forEach((file) => {
        try {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        } catch (e) {
          console.log(e.message);
        }
      });
    });
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
    test("test a model using the reserved 2019 test data set", async (): Promise<void> => {
      let allTeamNames = createTeamNameLookup();
      const model = await createModel();
      const { labelValues: testLabels, featureValues: testFeatures } = await getTrainingData(/^2019.*/);
      let mytests = createArrPrdFuncReqs(model, testFeatures, allTeamNames, testLabels);
      const predTests: Promise<PredictResult>[] = mytests.map((t): Promise<PredictResult> => t());
      const matchResults: PredictResult[] = await Promise.all(predTests);
      let total = 0;
      let matches = 0;
      matchResults.forEach((r): void => {
        console.log(r);
        total += 1;
        if (r.comparison) {
          matches++;
        }
      });
      console.log(`total = ${total} success rate = ${matches/total}`);
      expect(matches/total).toBeGreaterThan(0.5);
    }, LONG_TEST);
    test("Given a model save it to the file system", async(): Promise<void> => {
      const model: tf.Sequential = tf.sequential({
        layers: [
          tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
          tf.layers.dense({units: 10, activation: 'softmax'}),
        ]
      });
      const path = `file://${__dirname}`;
      const result: io.SaveResult = await save(model, path);
      expect(result).toBeTruthy()
    }, LONG_TEST);
  });
});
