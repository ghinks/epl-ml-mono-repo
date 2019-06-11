import createModel from "./index";
import * as tf from "@tensorflow/tfjs-node";
import getModelData from "./getModelData";
import TrainingData from "./getModelData";
import * as fs from 'fs';
import * as path from 'path';

jest.mock("./getModelData");

describe("Model Creation from test data", (): void => {
  const LONG_TIMEOUT: number = 30 * 1000;
  const Chelsea = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const WestHam = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0];
  beforeAll((): void => {
    const testFeatureValues = fs.readFileSync(path.join(__dirname, "./testData/testFeatureValues.json"), "utf-8");
    const testLabelValues = fs.readFileSync(path.join(__dirname, "./testData/testLabelValues.json"), "utf-8");
    // @ts-ignore
    let testTrainingData: TrainingData;
    testTrainingData = {
      labelValues: JSON.parse(testLabelValues),
      featureValues: JSON.parse(testFeatureValues)
    };
    getModelData.mockResolvedValue(testTrainingData);
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
    const testData = tf.tensor3d([ ...Chelsea, ...WestHam], [1,2,36], 'int32');
    const prediction = model.predict(testData);
    // @ts-ignore
    const result = await prediction.data();
    expect(result.length).toBe(3);
    const sumOfWeights = result[0] + result[1] + result[2];
    expect(sumOfWeights).toBeGreaterThan(0.90);
    expect(sumOfWeights).toBeLessThan(1.15);
  }, LONG_TIMEOUT);
});
