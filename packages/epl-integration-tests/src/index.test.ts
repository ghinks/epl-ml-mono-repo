import getHistoricalData , { MatchResult, getFixtures } from "@gvhinks/epl-data-reader";
import writeToDB, { writeFutureFixtures } from "@gvhinks/epl-data-to-db";
import createModel, { getTrainingData, TrainingData, save} from "@gvhinks/epl-base-model";
import * as tf from "@tensorflow/tfjs-node";
import { createArrPrdFuncReqs, createTeamNameLookup, getOneHotEncoding } from "@gvhinks/epl-utilities";
import { io } from '@tensorflow/tfjs-core';
import * as fs from "fs";
import * as path from "path";
import { PredictResult, Fixture, FixturePrediction } from "@gvhinks/epl-common-interfaces";
import { numAllTimeTeams, fixturesUrl } from "@gvhinks/epl-constants";
import { getPredictions, getFixtures as getFixturesFromHost, collateTable } from "@gvhinks/epl-season-forecast";

const LONG_TEST = 5 * 60 * 1000;

describe("Integration Tests", (): void => {
  const Chelsea = getOneHotEncoding("Chelsea");
  const WestHam = getOneHotEncoding("West Ham");
  describe("DB tests", (): void => {
    test("expect to git stuff back after you push data into the DB", async (): Promise<void> => {
      // const dataPath = path.resolve(path.join(__dirname, "../../epl-data-reader/data"))
      // console.log(dataPath);
      const stuff: MatchResult[] = await getHistoricalData();
      expect(stuff.length).toBeGreaterThan(0);
      const result = await writeToDB(stuff);
      expect(result).toBe(true);
    });
    test("expect to be able to write future fixtures to the DB", async (): Promise<void> => {
      const stuff: Fixture[] = await getFixtures();
      expect(stuff.length).toBeGreaterThan(0);
      const result = await writeFutureFixtures(stuff);
      expect(result).toBe(true);
    });
    test("expect to get data for Arsenal", async(): void => {
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
      const summary = results.labelValues.reduce((a: Aggregation, r: TrainingData): Aggregation => {
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

  async function predictChelseaWestHam(model): Promise<void> {
    const testData = tf.tensor3d([...Chelsea, ...WestHam], [1, 2, numAllTimeTeams], "int32");
    const prediction = model.predict(testData);
    // @ts-ignore
    const result = await prediction.data();
    expect(result.length).toBe(3);
    const sumOfWeights = result[0] + result[1] + result[2];
    expect(sumOfWeights).toBeGreaterThan(0.90);
    expect(sumOfWeights).toBeLessThan(1.15);
  }

  describe("Model Functional Tests", (): void => {
    afterAll((): void => {
      //remove test files if they exist
      const files = [`${__dirname}/model.json`, `${__dirname}/weights.bin`];
      files.forEach((file): void => {
        try {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        } catch (e) {
          console.log(e.message);
        }
      });
    });
    test("expect to create a model and make a prediction", async (): Promise<void> => {
      const model = await createModel();
      await predictChelseaWestHam(model);
    }, LONG_TEST);
    test("test a model using the reserved 2019 test data set", async (): Promise<void> => {
      let allTeamNames = createTeamNameLookup();
      const model = await createModel();
      const { labelValues: testLabels, featureValues: testFeatures } = await getTrainingData(new Date(2019, 1, 1), new Date( 2020, 7, 1));
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

  describe.only("Model Loading Tests from file", (): void => {
    test("Expect to load from file", async (): Promise<void> => {
      try {
        const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
        const file = `file:///${targetFile}`;
        console.log(file);
        await tf.loadLayersModel(file);
      } catch (e) {
        console.error(Array(100).join("#"));
        console.error(e.message);
        fail();
      }
    });
    test("expect to run the loaded model from file", async (): Promise<void> => {
      try {
        const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
        const file = `file:///${targetFile}`;
        console.log(file);
        const model = await tf.loadLayersModel(file);
        await predictChelseaWestHam(model);
      } catch (e) {
        console.error(Array(100).join("#"));
        console.error(e.message);
        fail();
      }
    }, LONG_TEST);
    test("expect to create a fixtures prediction", async (): Promise<void> => {
      try {
        const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
        const file = `file:///${targetFile}`;
        console.log(file);
        const model = await tf.loadLayersModel(file);
        console.log("got model");
        const fixtures: Fixture[] = await getFixturesFromHost();
        console.log("got fixtures");
        await getPredictions(fixtures, model);
      } catch (e) {
        console.error(Array(100).join("#"));
        console.error(e.message);
        fail();
      }
    });
    test("expect to create a table", async (): Promise<void> => {
      try {
        const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
        const file = `file:///${targetFile}`;
        console.log(file);
        const model = await tf.loadLayersModel(file);
        console.log("got model");
        const fixtures: Fixture[] = await getFixturesFromHost();
        console.log("got fixtures");
        const predictions: FixturePrediction[] = await getPredictions(fixtures, model);
        const table = collateTable(predictions);
        expect(table.length).toBeGreaterThan(0);
        console.log(JSON.stringify(table, null, 2));
      } catch (e) {
        console.error(Array(100).join("#"));
        console.error(e.message);
        fail();
      }
    });
  });
  describe("Model Loading Tests http", (): void => {
    test("expect to be able to load the model from the server", async (): Promise<void> => {
      try {
        const url = "http://localhost:3000/model.json"
        await tf.loadLayersModel(url);
      } catch (e) {
        console.error(Array(100).join("#"));
        console.error(e.message);
        fail();
      }
    });
    test("expect to run the loaded model", async (): Promise<void> => {
      try {
        const url = "http://localhost:3000/model.json"
        const model = await tf.loadLayersModel(url);
        await predictChelseaWestHam(model);
      } catch (e) {
        console.error(Array(100).join("#"));
        console.error(e.message);
        fail();
      }
    }, LONG_TEST);
  });
});
