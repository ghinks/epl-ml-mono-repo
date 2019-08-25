import * as tf from "@tensorflow/tfjs-node";
import { getOneHotEncoding } from "@gvhinks/epl-utilities";
import { numAllTimeTeams } from "@gvhinks/epl-constants";
import * as path from "path";
import { Fixture, FixturePrediction } from "@gvhinks/epl-common-interfaces";
import { getPredictions, getFixtures as getFixturesFromHost, collateTable } from "@gvhinks/epl-season-forecast";

const LONG_TEST = 5 * 60 * 1000;

describe("Integration Tests", (): void => {
  const Chelsea = getOneHotEncoding("Chelsea");
  const WestHam = getOneHotEncoding("West Ham");
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
  describe("Model Loading Tests from file", (): void => {
    test("Expect to load from file", async (): Promise<void> => {
      const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
      const file = `file:///${targetFile}`;
      const funcUnderTest = async (): Promise<void> => await tf.loadLayersModel(file);
      expect(funcUnderTest).not.toThrow();
    });
    test("expect to run the loaded model from file", async (): Promise<void> => {
      const funcUnderTest = async (): Promise<void> => {
        const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
        const file = `file:///${targetFile}`;
        const model = await tf.loadLayersModel(file);
        await predictChelseaWestHam(model);
      }
      expect(funcUnderTest).not.toThrow();
    }, LONG_TEST);
    test("expect to create a fixtures prediction", async (): Promise<void> => {
      const funcUnderTest = async (): Promise<void> => {
        const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
        const file = `file:///${targetFile}`;
        const model = await tf.loadLayersModel(file);
        const fixtures: Fixture[] = await getFixturesFromHost();
        await getPredictions(fixtures, model);
      }
      expect(funcUnderTest).not.toThrow();
    });
    test("expect to create a table", async (): Promise<void> => {
      const targetFile = path.resolve(path.join(__dirname, "../../epl-host-model/model", "model.json"));
      const file = `file:///${targetFile}`;
      const model = await tf.loadLayersModel(file);
      const fixtures: Fixture[] = await getFixturesFromHost();
      const predictions: FixturePrediction[] = await getPredictions(fixtures, model);
      const table = collateTable(predictions);
      expect(table.length).toBeGreaterThan(0);
    }, LONG_TEST);
  });
});


