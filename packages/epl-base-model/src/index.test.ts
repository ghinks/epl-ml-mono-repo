import createModel from "./index";
import * as tf from "@tensorflow/tfjs-node";
import getModelData from "./getModelData";
import TrainingData from "./getModelData";
import * as fs from 'fs';
import * as path from 'path';
import { createArrPrdFuncReqs, createTeamNameLookup, PredictResult, getOneHotEncoding } from "@gvhinks/epl-utilities";

jest.mock("./getModelData");
const fsProm = fs.promises;

describe("Model Creation from test data", (): void => {
  const LONG_TIMEOUT: number = 5 * 60 * 1000;
  const Chelsea = getOneHotEncoding("Chelsea");
  const WestHam = getOneHotEncoding("West Ham");
  const createModelTrainingData = async (): Promise<void> =>  {
    const testFeatureValues = await fsProm.readFile(path.join(__dirname, "./testData/trainingTestFeatureValues.json"), "utf-8");
    const testLabelValues = await fsProm.readFile(path.join(__dirname, "./testData/trainingTestLabelValues.json"), "utf-8");
    // @ts-ignore
    let trainingTestData: TrainingData;
    trainingTestData = {
      labelValues: JSON.parse(testLabelValues),
      featureValues: JSON.parse(testFeatureValues)
    };
    getModelData.mockResolvedValue(trainingTestData);
  }
  describe("model training", (): void => {
    beforeAll(async (): Promise<void> => {
      await createModelTrainingData();
    });
    afterAll((): void => {
      jest.clearAllMocks()
    });
    test("Expect to create a model", async (): Promise<void> => {
      const model: tf.Sequential = await createModel();
      expect(model.name).toBe("predict");
    }, LONG_TIMEOUT);
    test("Expect to make a prediction", async (): Promise<void> => {
      const model: tf.Sequential = await createModel();
      const testData = tf.tensor3d([ ...Chelsea, ...WestHam], [1,2,43], 'int32');
      const prediction = model.predict(testData);
      // @ts-ignore
      const result = await prediction.data();
      expect(result.length).toBe(3);
      const sumOfWeights = result[0] + result[1] + result[2];
      expect(sumOfWeights).toBeGreaterThan(0.50);
      expect(sumOfWeights).toBeLessThan(1.50);
    }, LONG_TIMEOUT);
  });
  describe("model testing", (): void => {
    let model: tf.Sequential;
    let testFeatureValues: number[][][];
    let testLabelValues: number[][];
    let teamNames: Map<string, string>;
    beforeAll(async (): Promise<void> => {
      await createModelTrainingData();
      model = await createModel();
      teamNames = createTeamNameLookup();
      testFeatureValues = JSON.parse(await fsProm.readFile(path.join(__dirname, "./testData/testingFeatureValues.json"), "utf-8"));
      testLabelValues = JSON.parse(await fsProm.readFile(path.join(__dirname, "./testData/testingLabelValues.json"), "utf-8"));
    }, LONG_TIMEOUT);
    // the model once trained should be expected to have similar results to the test
    // data set that was held back from the initial full data set in order to run these
    // on the resultant model.
    test("expect the model to predict similar results to test data", async (): Promise<void> => {
      let mytests = createArrPrdFuncReqs(model, testFeatureValues, teamNames, testLabelValues);
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
    }, LONG_TIMEOUT);
  });
});
