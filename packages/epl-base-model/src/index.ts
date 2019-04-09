import * as tf from "@tensorflow/tfjs-node";
import getData, { BaseResult } from "./getModelData";

const createModel = async (): Promise<tf.Sequential> => {
  const rawData: BaseResult[] = await getData("Arsenal");
  const model: tf.Sequential = tf.sequential();
  model.add(tf.layers.dense({inputShape: [3], units: 1, useBias: true}));
  model.add(tf.layers.dense({units: 1, useBias: true}));
  return model;
}

export { getData, BaseResult, createModel as default };
