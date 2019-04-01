import tf, { Sequential } from "@tensorflow/tfjs-node";
import getData, { BaseResult } from "./getModelData";

const createModel = async (): Promise<Sequential> => {
  const rawData: BaseResult[] = await getData("Arsenal");
  const model: Sequential = tf.sequential();
  model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
  model.add(tf.layers.dense({units: 1, useBias: true}));
  return model;
}

export default createModel;
