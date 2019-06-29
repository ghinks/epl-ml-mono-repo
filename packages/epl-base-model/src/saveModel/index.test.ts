import save from "./index";
import * as tf from "@tensorflow/tfjs-node";
import { io } from '@tensorflow/tfjs-core';

describe("Save a model to the local file system", () => {
  let model: tf.Sequential;
  beforeAll(() => {
    model = tf.sequential({
      layers: [
        tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
        tf.layers.dense({units: 10, activation: 'softmax'}),
      ]
    });
  });

  test("Given a model save it to the file system", async(): Promise<void> => {
    const path = `file://${__dirname}`;
    const result: io.SaveResult = await save(model, path);
    expect(result).toBeTruthy()
  });
});
