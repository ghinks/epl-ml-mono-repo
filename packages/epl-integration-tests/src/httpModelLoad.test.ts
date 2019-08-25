import * as tf from "@tensorflow/tfjs-node";
import { getOneHotEncoding } from "@gvhinks/epl-utilities";
import { numAllTimeTeams } from "@gvhinks/epl-constants";
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
  describe("Model Loading Tests http", (): void => {
    test("expect to be able to load the model from the server", async (): Promise<void> => {
      const url = "http://localhost:3000/model.json"
      const funcUnderTest = async (): Promise<tf.LayersModel> => await tf.loadLayersModel(url);
      expect(funcUnderTest).not.toThrow();
    }, LONG_TEST);
    test("expect to run the loaded model", async (): Promise<void> => {
      const funcUnderTest = async (): Promise<void> => {
        const url = "http://localhost:3000/model.json"
        const model = await tf.loadLayersModel(url);
        await predictChelseaWestHam(model);
      };
      expect(funcUnderTest).not.toThrow();
    }, LONG_TEST);
  });
});


