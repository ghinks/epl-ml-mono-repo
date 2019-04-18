import * as tf from "@tensorflow/tfjs-node";
import getData, { BaseResult } from "./getModelData";

const tensorsFromRaw = (raw: BaseResult[]): tf.Tensor3D => {
  return tf.tensor3d([1,2,3]);
};

const createModel = async (): Promise<tf.Sequential> => {
  const model: tf.Sequential = tf.sequential();
  model.add(tf.layers.dense({inputShape: [3], units: 1, useBias: true}));
  model.add(tf.layers.dense({units: 1, useBias: true}));
  const rawData: BaseResult[] = await getData("Arsenal");
  return model;
};

export { getData, BaseResult, createModel as default };
